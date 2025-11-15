import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Video, VideoOff, Mic, MicOff, PhoneOff, Monitor, Settings } from "lucide-react";

export default function Telemedicine() {
  const [inCall, setInCall] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const upcomingSessions = [
    {
      id: "session-1",
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      time: "Today at 2:00 PM",
      duration: "30 min",
    },
    {
      id: "session-2",
      doctor: "Dr. Michael Chen",
      specialty: "General Practitioner",
      time: "Tomorrow at 10:30 AM",
      duration: "45 min",
    },
  ];

  if (inCall) {
    return (
      <div className="h-full flex flex-col">
        <div className="pb-4">
          <h1 className="text-3xl font-bold text-foreground">Telemedicine Session</h1>
          <p className="text-sm text-muted-foreground mt-1">Dr. Sarah Johnson - Cardiologist</p>
        </div>

        <div className="flex-1 relative bg-card rounded-md overflow-hidden min-h-0">
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">SJ</AvatarFallback>
              </Avatar>
              <p className="text-lg font-semibold text-foreground">Dr. Sarah Johnson</p>
              <Badge className="mt-2" variant="outline">Connected</Badge>
            </div>
          </div>

          <div className="absolute top-4 right-4 w-48 aspect-video bg-background rounded-md border-2 border-border overflow-hidden">
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary text-primary-foreground">You</AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background/95 to-transparent backdrop-blur-sm">
            <div className="flex items-center justify-center gap-4">
              <Button
                size="icon"
                variant={audioEnabled ? "outline" : "destructive"}
                className="h-12 w-12 rounded-full"
                onClick={() => setAudioEnabled(!audioEnabled)}
                data-testid="button-toggle-audio"
              >
                {audioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>
              <Button
                size="icon"
                variant={videoEnabled ? "outline" : "destructive"}
                className="h-12 w-12 rounded-full"
                onClick={() => setVideoEnabled(!videoEnabled)}
                data-testid="button-toggle-video"
              >
                {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>
              <Button
                size="icon"
                variant="destructive"
                className="h-14 w-14 rounded-full"
                onClick={() => setInCall(false)}
                data-testid="button-end-call"
              >
                <PhoneOff className="h-6 w-6" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="h-12 w-12 rounded-full"
                data-testid="button-share-screen"
              >
                <Monitor className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="h-12 w-12 rounded-full"
                data-testid="button-settings"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Telemedicine</h1>
        <p className="text-sm text-muted-foreground mt-1">Virtual healthcare consultations</p>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between gap-4 p-4 rounded-md bg-muted/50"
                data-testid={`session-${session.id}`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {session.doctor.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{session.doctor}</p>
                    <p className="text-sm text-muted-foreground">{session.specialty}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span>{session.time}</span>
                      <span>•</span>
                      <span>{session.duration}</span>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => setInCall(true)}
                  data-testid={`button-join-session-${session.id}`}
                >
                  <Video className="h-4 w-4 mr-2" />
                  Join
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Start</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Before you start</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>Ensure your camera and microphone are working</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>Find a quiet, well-lit location</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>Have your medical history ready</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>Prepare a list of questions or concerns</span>
                </li>
              </ul>
            </div>
            <Button className="w-full" variant="outline" data-testid="button-test-connection">
              Test Audio & Video
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Consultations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">No recent consultations</p>
        </CardContent>
      </Card>
    </div>
  );
}
