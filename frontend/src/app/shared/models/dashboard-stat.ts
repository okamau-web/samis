export type Trend = 'up' | 'down' | 'neutral';

export interface DashboardStat {
  title: string;
  value: number;
  icon: string;
  color: string;
  change: string;
  trend:Trend, 
  route: string;
}