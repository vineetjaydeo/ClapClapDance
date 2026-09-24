#!/usr/bin/env python3
"""Local records for the ClapClapDance research workflow; Python standard library only.

Validates evidence and emits descriptive reviews. It neither fetches analytics nor
publishes videos, evaluates statistical significance, or chooses experiment winners.
"""
import argparse
import csv
import hashlib
import json
import math
import os
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

ROOT = Path(__file__).resolve().parents[1]
MEDIA = {'.mp4', '.mov', '.webm', '.mp3', '.wav', '.aac', '.m4a',
         '.png', '.jpg', '.jpeg', '.webp', '.gif', '.blend', '.zip', '.psd'}
SKIP = {'.git', '.venv', 'venv', 'node_modules', '__pycache__', '.private'}
NUMBERS = {'views', 'impressions', 'ctr_pct', 'watch_time_hours',
           'watch_time_from_impressions_hours', 'avg_view_duration_seconds',
           'avg_percentage_viewed', 'retention_30s_pct'}
RESULT_STATUSES = {'keep_provisional', 'discard', 'inconclusive', 'invalid'}


def headers():
    with (ROOT / 'templates/observations.csv').open(newline='') as handle:
        return next(csv.reader(handle))


def timestamp(value):
    parsed = datetime.fromisoformat(value.replace('Z', '+00:00'))
    if parsed.tzinfo is None:
        raise ValueError('captured_at needs an explicit timezone')
    return parsed


def number(value, field):
    if value == '':
        return None
    result = float(value)
    if not math.isfinite(result) or result < 0:
        raise ValueError(f'{field} must be finite and nonnegative, or blank')
    if field in {'views', 'impressions'} and not result.is_integer():
        raise ValueError(f'{field} must be an integer count')
    if field == 'ctr_pct' and result > 100:
        raise ValueError('ctr_pct must use percentage units between 0 and 100')
    return result


def read_observations(path):
    with Path(path).open(newline='', encoding='utf-8-sig') as handle:
        reader = csv.DictReader(handle)
        if reader.fieldnames != headers():
            raise ValueError('CSV header must match templates/observations.csv exactly')
        rows = list(reader)
    ids, cohorts = set(), set()
    for index, row in enumerate(rows, start=2):
        try:
            if None in row or any(value is None for value in row.values()):
                raise ValueError('wrong number of CSV fields')
            for key in ('observation_id', 'video_id', 'format', 'age_band',
                        'traffic_scope', 'source_reference', 'published_on'):
                if not row[key].strip():
                    raise ValueError(f'{key} is required')
            if row['observation_id'] in ids:
                raise ValueError('duplicate observation_id')
            ids.add(row['observation_id'])
            capture = timestamp(row['captured_at'])
            start, end = date.fromisoformat(row['window_start']), date.fromisoformat(row['window_end'])
            published = date.fromisoformat(row['published_on'])
            days = int(row['window_days'])
            if days <= 0 or days != (end - start).days + 1:
                raise ValueError('inclusive dates do not match window_days')
            if start < published:
                raise ValueError('window starts before publication')
            basis = row['window_basis']
            if basis not in {'since_publish', 'first_7_complete_days', 'first_28_complete_days', 'custom'}:
                raise ValueError('unknown window_basis')
            expected = {'first_7_complete_days': 7, 'first_28_complete_days': 28}.get(basis)
            if expected and (days != expected or start != published + timedelta(days=1)):
                raise ValueError('complete-day cohort must start the day after publication and have the declared length')
            if basis == 'since_publish' and start != published:
                raise ValueError('since_publish must start on published_on')
            if row['availability'] not in {'processing', 'complete', 'unavailable'}:
                raise ValueError('unknown availability')
            if row['format'] not in {'long_form', 'shorts', 'compilation'}:
                raise ValueError('unknown format')
            if row['quality_status'] not in {'pass', 'fail', 'unknown'}:
                raise ValueError('unknown quality_status')
            if row['rights_status'] not in {'verified', 'unverified', 'failed'}:
                raise ValueError('unknown rights_status')
            if row['funnel_cohort_matches'] not in {'true', 'false', 'unknown'}:
                raise ValueError('unknown funnel_cohort_matches')
            try:
                report_zone = ZoneInfo(row['report_timezone'])
            except ZoneInfoNotFoundError:
                if row['availability'] == 'complete' or row['report_timezone'] != 'not_displayed':
                    raise ValueError('complete reports require an IANA reporting timezone') from None
                report_zone = timezone.utc
            if row['availability'] == 'complete' and end >= capture.astimezone(report_zone).date():
                raise ValueError('complete report includes a current or future partial day')
            cohort = tuple(row[key] for key in ('video_id', 'format', 'age_band', 'window_basis',
                           'window_start', 'window_end', 'report_timezone', 'traffic_scope'))
            if cohort in cohorts:
                raise ValueError('duplicate cohort: select one capture for this review; do not double-count snapshots')
            cohorts.add(cohort)
            for field in NUMBERS:
                row[field] = number(row[field], field)
            if row['impressions'] == 0 and row['ctr_pct'] not in (None, 0):
                raise ValueError('positive CTR with zero impressions')
            if row['watch_time_from_impressions_hours'] is not None:
                if row['funnel_cohort_matches'] != 'true' or row['impressions'] in (None, 0):
                    raise ValueError('funnel calculation requires confirmed matching cohort and positive impressions')
        except (ValueError, TypeError) as error:
            raise ValueError(f'CSV line {index}: {error}') from error
    return rows


def review_row(row):
    blockers = []
    if row['format'] != 'long_form':
        blockers.append('separate format protocol required')
    if row['window_basis'] not in {'first_7_complete_days', 'first_28_complete_days'}:
        blockers.append('not a standard complete-day experiment window')
    if row['availability'] != 'complete':
        blockers.append('data not complete')
    if row['views'] is None or row['views'] < 200:
        blockers.append('below provisional 200-view floor')
    if row['avg_percentage_viewed'] is None or row['retention_30s_pct'] is None:
        blockers.append('APV or 30-second retention unavailable')
    if row['quality_status'] != 'pass' or row['rights_status'] != 'verified':
        blockers.append('quality or rights evidence incomplete/failed')
    funnel = None
    if row['watch_time_from_impressions_hours'] is not None:
        funnel = row['watch_time_from_impressions_hours'] * 60 * 1000 / row['impressions']
    return {
        'observation_id': row['observation_id'],
        'video_id': row['video_id'],
        'review_status': 'insufficient_data' if blockers else 'ready_for_manual_review',
        'reasons': blockers,
        'packaging_floor_met': row['impressions'] is not None and row['impressions'] >= 1000,
        'minutes_per_1000_impressions': funnel,
        'source_reference': row['source_reference'],
    }


def review(path):
    rows = read_observations(path)
    return {
        'protocol_version': 'v1',
        'input': str(path),
        'row_count': len(rows),
        'limitation': 'Descriptive readiness only. Floors are not statistical power; no ranking, pooling, causal effect or winner is inferred. Compare only matched cohorts under a preregistered experiment.',
        'observations': [review_row(row) for row in rows],
    }


def load_json(relative):
    return json.loads((ROOT / relative).read_text())


def check_records():
    sources = load_json('research/sources.json')['sources']
    hypotheses = load_json('experiments/hypotheses.json')['hypotheses']
    source_ids = [entry['id'] for entry in sources]
    hypothesis_ids = [entry['id'] for entry in hypotheses]
    if len(set(source_ids)) != len(source_ids) or len(set(hypothesis_ids)) != len(hypothesis_ids):
        raise ValueError('duplicate source or hypothesis ID')
    for source in sources:
        if not source['url'].startswith('https://'):
            raise ValueError(f"source {source['id']} needs an HTTPS reference")
        date.fromisoformat(source['accessed_on'])
    for hypothesis in hypotheses:
        missing = set(hypothesis['source_ids']) - set(source_ids)
        if missing:
            raise ValueError(f"unknown sources for {hypothesis['id']}: {sorted(missing)}")
    with (ROOT / 'experiments/results.tsv').open(newline='') as handle:
        reader = csv.DictReader(handle, delimiter='\t')
        required = ['experiment_id', 'hypothesis_id', 'decision_date', 'protocol_version',
                    'status', 'evidence_path', 'decision', 'limitations']
        if reader.fieldnames != required:
            raise ValueError('results header does not match the protocol')
        results = list(reader)
    seen_results = set()
    for row in results:
        if None in row or any(value is None or not value.strip() for value in row.values()):
            raise ValueError('result row has missing/extra fields')
        if row['experiment_id'] in seen_results:
            raise ValueError('result IDs must be unique; revisions need a new ID')
        seen_results.add(row['experiment_id'])
        date.fromisoformat(row['decision_date'])
        if row['protocol_version'] != 'v1' or row['status'] not in RESULT_STATUSES:
            raise ValueError('unknown protocol or result decision status')
        if row['hypothesis_id'] not in hypothesis_ids:
            raise ValueError('unknown hypothesis in results')
        evidence = (ROOT / row['evidence_path']).resolve()
        if not evidence.is_relative_to(ROOT) or not evidence.is_file():
            raise ValueError('result requires a repository evidence document')
    read_observations(ROOT / 'templates/observations.csv')
    return {'sources': len(sources), 'hypotheses': len(hypotheses),
            'completed_experiments': len(results), 'status': 'valid'}


def inventory():
    entries = []
    receipt_path = ROOT / 'assets/remote-verification.json'
    receipt = json.loads(receipt_path.read_text()) if receipt_path.exists() else {}
    verified_oids = set(receipt.get('verified_oids', []))
    for base, dirs, files in os.walk(ROOT):
        dirs[:] = sorted(d for d in dirs if d not in SKIP)
        relative_base = Path(base).relative_to(ROOT)
        if relative_base.parts[:2] in {('data', 'raw'), ('data', 'analytics')}:
            dirs[:] = []
            continue
        for name in sorted(files):
            path = Path(base) / name
            if path.suffix.lower() not in MEDIA or path.is_symlink():
                continue
            sha = hashlib.sha256()
            with path.open('rb') as handle:
                for chunk in iter(lambda: handle.read(1024 * 1024), b''):
                    sha.update(chunk)
            oid = sha.hexdigest()
            entries.append({'path': str(path.relative_to(ROOT)), 'bytes': path.stat().st_size,
                            'sha256': oid, 'storage': 'git_lfs',
                            'backup_status': 'verified_github_lfs' if oid in verified_oids else 'remote_unverified'})
    payload = {'generated_at': datetime.now(timezone.utc).isoformat(),
               'notice': 'Inventory does not upload files. Verified status means this SHA-256 was downloaded and checked against GitHub LFS in the separate remote-verification receipt; changed files need a new verification.',
               'files': entries}
    target = ROOT / 'assets/manifest.json'
    target.parent.mkdir(exist_ok=True)
    target.write_text(json.dumps(payload, indent=2) + '\n')
    return {'media_files': len(entries), 'bytes': sum(item['bytes'] for item in entries),
            'manifest': 'assets/manifest.json',
            'remote_verified_files': sum(item['backup_status'] == 'verified_github_lfs' for item in entries)}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest='command', required=True)
    sub.add_parser('check')
    sub.add_parser('status')
    sub.add_parser('inventory')
    rev = sub.add_parser('review')
    rev.add_argument('--metrics', type=Path, required=True)
    rev.add_argument('--output', type=Path, help='Optional local JSON output; use .private/ for private inputs')
    args = parser.parse_args()
    try:
        if args.command in {'check', 'status'}:
            output = check_records()
            if args.command == 'status':
                output['next_action'] = 'Capture mature baseline evidence and prepare one preregistered experiment; no winner exists yet.' if not output['completed_experiments'] else 'Read latest cycle and completed decisions before selecting the next question.'
        elif args.command == 'inventory':
            output = inventory()
        else:
            output = review(args.metrics)
            if args.output:
                args.output.parent.mkdir(parents=True, exist_ok=True)
                args.output.write_text(json.dumps(output, indent=2) + '\n')
        print(json.dumps(output, indent=2))
    except (ValueError, OSError, KeyError) as error:
        parser.exit(2, f'Error: {error}\n')


if __name__ == '__main__':
    main()
