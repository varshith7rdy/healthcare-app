import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Heart, TrendingUp, Zap, Moon, Smartphone, Watch } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

const devices = [
  {
    id: "device-1",
    name: "Apple Watch Series 9",
    type: "Smartwatch",
    icon: Watch,
    connected: true,
    lastSync: "2 minutes ago",
    battery: 85,
  },
  {
    id: "device-2",
    name: "Fitbit Charge 6",
    type: "Fitness Tracker",
    icon: Activity,
    connected: true,
    lastSync: "1 hour ago",
    battery: 62,
  },
  {
    id: "device-3",
    name: "iPhone Health",
    type: "Mobile App",
    icon: Smartphone,
    connected: true,
    lastSync: "Just now",
    battery: null,
  },
];

const metrics = [
  {
    title: "Heart Rate",
    value: "72",
    unit: "bpm",
    icon: Heart,
    color: "text-chart-1",
    trend: "Normal",
    data: [68, 70, 72, 71, 73, 72, 71, 72],
  },
  {
    title: "Steps",
    value: "8,542",
    unit: "steps",
    icon: Activity,
    color: "text-chart-2",
    trend: "+12% today",
    data: [2000, 3500, 4200, 5800, 6500, 7200, 7800, 8542],
  },
  {
    title: "Calories",
    value: "1,847",
    unit: "kcal",
    icon: Zap,
    color: "text-chart-4",
    trend: "On track",
    data: [200, 450, 680, 920, 1180, 1420, 1650, 1847],
  },
  {
    title: "Sleep",
    value: "7.5",
    unit: "hours",
    icon: Moon,
    color: "text-chart-3",
    trend: "Good quality",
    data: [7.2, 6.8, 7.5, 8.1, 7.0, 7.3, 7.8, 7.5],
  },
];

const weeklyData = [
  { day: "Mon", steps: 7200, sleep: 7.2, heartRate: 71 },
  { day: "Tue", steps: 8100, sleep: 6.8, heartRate: 73 },
  { day: "Wed", steps: 6800, sleep: 7.5, heartRate: 70 },
  { day: "Thu", steps: 9200, sleep: 8.1, heartRate: 72 },
  { day: "Fri", steps: 8542, sleep: 7.0, heartRate: 74 },
  { day: "Sat", steps: 5200, sleep: 7.3, heartRate: 69 },
  { day: "Sun", steps: 6400, sleep: 7.8, heartRate: 71 },
];

export default function Wearables() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Wearables</h1>
          <p className="text-sm text-muted-foreground mt-1">Track your health data from connected devices</p>
        </div>
        <Button data-testid="button-sync-devices">
          <Activity className="h-4 w-4 mr-2" />
          Sync All Devices
        </Button>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {devices.map((device) => (
          <Card key={device.id} data-testid={`device-${device.id}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 flex-shrink-0">
                    <device.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{device.name}</h3>
                    <p className="text-xs text-muted-foreground">{device.type}</p>
                  </div>
                </div>
                <Badge variant={device.connected ? "default" : "outline"} className="flex-shrink-0">
                  {device.connected ? "Connected" : "Offline"}
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Last sync</span>
                  <span className="text-foreground">{device.lastSync}</span>
                </div>
                {device.battery !== null && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Battery</span>
                    <span className="text-foreground">{device.battery}%</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title} data-testid={`metric-${metric.title.toLowerCase()}`}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
              <metric.icon className={`h-5 w-5 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2 mb-3">
                <div className="text-3xl font-bold text-foreground">{metric.value}</div>
                <span className="text-sm text-muted-foreground">{metric.unit}</span>
              </div>
              <ResponsiveContainer width="100%" height={40}>
                <LineChart data={metric.data.map((v, i) => ({ value: v }))}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={`hsl(var(--chart-${["1", "2", "4", "3"][metrics.indexOf(metric)]}))`}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-chart-2" />
                <span className="text-xs text-muted-foreground">{metric.trend}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Activity Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-md bg-muted/50">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-chart-2/10 flex-shrink-0">
                  <TrendingUp className="h-4 w-4 text-chart-2" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Great Progress!</h4>
                  <p className="text-sm text-muted-foreground">
                    You're averaging 7,629 steps per day this week, which is 12% higher than last week. Keep up the excellent work!
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-md bg-muted/50">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-chart-3/10 flex-shrink-0">
                  <Moon className="h-4 w-4 text-chart-3" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Sleep Pattern Detected</h4>
                  <p className="text-sm text-muted-foreground">
                    Your sleep quality has been consistent at 7.4 hours average. Consider maintaining this healthy pattern.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
