import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Calendar, Heart, TrendingUp, Clock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import type { Appointment, WearableData, HealthMetric } from "@shared/schema";

const activityData = [
  { day: "Mon", steps: 7200, calories: 320 },
  { day: "Tue", steps: 8100, calories: 380 },
  { day: "Wed", steps: 6800, calories: 290 },
  { day: "Thu", steps: 9200, calories: 420 },
  { day: "Fri", steps: 8542, calories: 390 },
  { day: "Sat", steps: 5200, calories: 240 },
  { day: "Sun", steps: 6400, calories: 280 },
];

const heartRateData = [
  { time: "00:00", bpm: 68 },
  { time: "04:00", bpm: 62 },
  { time: "08:00", bpm: 75 },
  { time: "12:00", bpm: 82 },
  { time: "16:00", bpm: 78 },
  { time: "20:00", bpm: 72 },
  { time: "24:00", bpm: 70 },
];

export default function Dashboard() {
  const { data: appointments, isLoading: appointmentsLoading } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
  });

  const { data: latestWearable, isLoading: wearableLoading } = useQuery<WearableData>({
    queryKey: ["/api/wearables/latest"],
  });

  const { data: healthMetrics, isLoading: metricsLoading } = useQuery<HealthMetric[]>({
    queryKey: ["/api/health/metrics"],
  });

  const upcomingAppointments = appointments?.filter(apt => apt.status !== "completed").slice(0, 2) || [];

  const metrics = [
    {
      title: "Heart Rate",
      value: latestWearable?.heartRate?.toString() || "72",
      unit: "bpm",
      trend: "+2%",
      icon: Heart,
      color: "text-chart-1",
      loading: wearableLoading,
    },
    {
      title: "Steps Today",
      value: latestWearable?.steps?.toLocaleString() || "8,542",
      unit: "steps",
      trend: "+12%",
      icon: Activity,
      color: "text-chart-2",
      loading: wearableLoading,
    },
    {
      title: "Sleep Quality",
      value: latestWearable?.sleepHours?.toString() || "7.5",
      unit: "hours",
      trend: "-5%",
      icon: Clock,
      color: "text-chart-3",
      loading: wearableLoading,
    },
    {
      title: "Appointments",
      value: upcomingAppointments.length.toString(),
      unit: "upcoming",
      trend: "",
      icon: Calendar,
      color: "text-chart-4",
      loading: appointmentsLoading,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back! Here's your health overview.</p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title} data-testid={`card-metric-${metric.title.toLowerCase().replace(/\s+/g, '-')}`}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-5 w-5 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              {metric.loading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <>
                  <div className="flex items-baseline gap-2">
                    <div className="text-3xl font-bold text-foreground" data-testid={`text-${metric.title.toLowerCase().replace(/\s+/g, '-')}-value`}>
                      {metric.value}
                    </div>
                    <span className="text-sm text-muted-foreground">{metric.unit}</span>
                  </div>
                  {metric.trend && (
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="h-4 w-4 text-chart-2" />
                      <span className="text-xs text-muted-foreground">{metric.trend} from last week</span>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Heart Rate Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={heartRateData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Line type="monotone" dataKey="bpm" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Bar dataKey="steps" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 flex-wrap">
            <CardTitle className="text-lg font-semibold">Upcoming Appointments</CardTitle>
            <Link href="/appointments">
              <Button variant="outline" size="sm" data-testid="button-view-all-appointments">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {appointmentsLoading ? (
              <>
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </>
            ) : upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between gap-4 p-4 rounded-md bg-muted/50"
                  data-testid={`appointment-${apt.id}`}
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{apt.doctorName}</p>
                      <Badge variant="outline" className="text-xs">{apt.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{apt.doctorSpecialty}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(apt.appointmentDate).toLocaleDateString()} at {apt.appointmentTime}</span>
                    </div>
                  </div>
                  <Button size="sm" data-testid={`button-join-${apt.id}`}>Join</Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No upcoming appointments</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 flex-wrap">
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/assistant">
              <Button className="w-full justify-start gap-2" variant="outline" data-testid="button-ask-assistant">
                <MessageSquare className="h-4 w-4" />
                Ask Virtual Assistant
              </Button>
            </Link>
            <Link href="/appointments">
              <Button className="w-full justify-start gap-2" variant="outline" data-testid="button-book-appointment">
                <Calendar className="h-4 w-4" />
                Book New Appointment
              </Button>
            </Link>
            <Link href="/wearables">
              <Button className="w-full justify-start gap-2" variant="outline" data-testid="button-sync-devices">
                <Activity className="h-4 w-4" />
                Sync Wearable Devices
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
