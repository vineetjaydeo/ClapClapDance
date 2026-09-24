"""Synthetic boundary fixtures only; these are not channel experiment results."""
import csv
import importlib.util
import tempfile
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location('lab', Path(__file__).parents[1] / 'scripts/lab.py')
lab = importlib.util.module_from_spec(spec)
spec.loader.exec_module(lab)


class EvidenceBoundaryTests(unittest.TestCase):
    def row(self, **updates):
        row = dict.fromkeys(lab.headers(), '')
        row.update(observation_id='synthetic-1', captured_at='2026-09-11T12:00:00+00:00',
                   video_id='synthetic-video', format='long_form', age_band='3-5',
                   published_on='2026-09-01', window_basis='first_7_complete_days',
                   window_start='2026-09-02', window_end='2026-09-08', window_days='7',
                   report_timezone='UTC', traffic_scope='all', availability='complete',
                   views='500', impressions='2000', ctr_pct='5', watch_time_hours='10',
                   funnel_cohort_matches='unknown', avg_percentage_viewed='60',
                   retention_30s_pct='70', quality_status='pass', rights_status='verified',
                   source_reference='synthetic test fixture')
        row.update(updates)
        return row

    def read(self, rows):
        with tempfile.TemporaryDirectory() as folder:
            target = Path(folder) / 'synthetic.csv'
            with target.open('w', newline='') as handle:
                writer = csv.DictWriter(handle, fieldnames=lab.headers())
                writer.writeheader()
                writer.writerows(rows)
            return lab.read_observations(target)

    def test_missing_is_not_zero_and_prevents_readiness(self):
        row = self.read([self.row(retention_30s_pct='')])[0]
        self.assertIsNone(row['retention_30s_pct'])
        self.assertEqual(lab.review_row(row)['review_status'], 'insufficient_data')

    def test_zero_is_retained_as_an_observation(self):
        row = self.read([self.row(retention_30s_pct='0')])[0]
        self.assertEqual(row['retention_30s_pct'], 0)

    def test_small_and_processing_data_cannot_pass(self):
        row = self.read([self.row(views='15', availability='processing')])[0]
        self.assertEqual(lab.review_row(row)['review_status'], 'insufficient_data')

    def test_total_watch_time_is_never_a_funnel_numerator(self):
        row = self.read([self.row(watch_time_hours='999')])[0]
        self.assertIsNone(lab.review_row(row)['minutes_per_1000_impressions'])

    def test_matching_funnel_units_and_zero_are_correct(self):
        row = self.read([self.row(watch_time_from_impressions_hours='2', funnel_cohort_matches='true')])[0]
        self.assertEqual(lab.review_row(row)['minutes_per_1000_impressions'], 60)
        row = self.read([self.row(watch_time_from_impressions_hours='0', funnel_cohort_matches='true')])[0]
        self.assertEqual(lab.review_row(row)['minutes_per_1000_impressions'], 0)

    def test_unmatched_funnel_is_rejected(self):
        with self.assertRaisesRegex(ValueError, 'matching cohort'):
            self.read([self.row(watch_time_from_impressions_hours='2')])

    def test_duplicate_snapshots_cannot_double_count(self):
        with self.assertRaisesRegex(ValueError, 'duplicate cohort'):
            self.read([self.row(), self.row(observation_id='synthetic-2')])

    def test_invalid_count_or_period_is_rejected(self):
        for changes in ({'views': 'nan'}, {'impressions': '-1'}, {'views': '1.5'},
                        {'window_days': '28'}, {'window_start': '2026-09-01', 'window_end': '2026-09-07'},
                        {'captured_at': '2026-09-08T12:00:00+00:00'}):
            with self.subTest(changes=changes), self.assertRaises(ValueError):
                self.read([self.row(**changes)])

    def test_shorts_never_use_long_form_readiness(self):
        row = self.read([self.row(format='shorts')])[0]
        self.assertEqual(lab.review_row(row)['review_status'], 'insufficient_data')

    def test_ready_is_not_a_winner_or_causal_claim(self):
        row = self.read([self.row()])[0]
        output = lab.review_row(row)
        self.assertEqual(output['review_status'], 'ready_for_manual_review')
        self.assertNotIn('winner', output)
        self.assertNotIn('p_value', output)


if __name__ == '__main__':
    unittest.main()
