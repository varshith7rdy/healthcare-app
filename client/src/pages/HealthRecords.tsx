import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, Pill, Activity, Syringe } from "lucide-react";

export default function HealthRecords() {
  // ⭐ SAMPLE DATA
  const medicalHistory = [
    {
      date: "2024-08-12",
      title: "General Health Checkup",
      details: "Blood work, ECG, physical examination",
      status: "Completed",
    },
    {
      date: "2024-05-22",
      title: "Dermatology Consultation",
      details: "Seborrheic dermatitis assessment, medication given",
      status: "Completed",
    },
    {
      date: "2023-12-10",
      title: "ENT Specialist Visit",
      details: "Mild sinus infection treated",
      status: "Completed",
    },
  ];

  const labReports = [
    {
      name: "Complete Blood Count (CBC)",
      date: "2024-08-12",
      status: "Normal",
      file: "#",
    },
    {
      name: "Liver Function Test (LFT)",
      date: "2024-08-12",
      status: "Slightly Elevated",
      file: "#",
    },
    {
      name: "Vitamin D Levels",
      date: "2023-12-10",
      status: "Low",
      file: "#",
    },
  ];

  const medications = [
    {
      name: "Ketoconazole 2% Shampoo",
      usage: "Twice a week",
      duration: "2 months",
    },
    {
      name: "Vitamin D3 Supplement",
      usage: "Daily 1000 IU",
      duration: "3 months",
    },
    {
      name: "Cetirizine 10mg",
      usage: "Once daily (as needed)",
      duration: "When symptoms appear",
    },
  ];

  const vaccinations = [
    { name: "COVID-19 (Covishield)", date: "2021-04-17" },
    { name: "Tetanus Booster", date: "2023-09-16" },
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Health Records</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Access your medical history, lab reports, medications, and vaccinations.
        </p>
      </div>

      {/* MEDICAL HISTORY */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Medical History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {medicalHistory.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border bg-muted/40 hover:bg-muted transition"
            >
              <div className="flex justify-between items-center mb-1">
                <p className="font-semibold">{item.title}</p>
                <Badge variant="outline">{item.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{item.details}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Calendar className="h-3 w-3" />
                {new Date(item.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* LAB REPORTS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Lab Reports
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {labReports.map((report, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border flex justify-between items-center bg-muted/40 hover:bg-muted transition"
            >
              <div>
                <p className="font-medium">{report.name}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(report.date).toLocaleDateString()}
                </p>
                <Badge className="mt-1" variant="outline">
                  {report.status}
                </Badge>
              </div>
              <a href={report.file} className="text-primary text-sm underline">
                View PDF
              </a>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* MEDICATIONS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-primary" />
            Medications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {medications.map((med, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border bg-muted/40 hover:bg-muted transition"
            >
              <p className="font-medium">{med.name}</p>
              <p className="text-sm text-muted-foreground">
                Usage: {med.usage}
              </p>
              <p className="text-xs text-muted-foreground">
                Duration: {med.duration}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* VACCINATIONS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Syringe className="h-5 w-5 text-primary" />
            Vaccination History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {vaccinations.map((vaccine, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border bg-muted/40 hover:bg-muted transition"
            >
              <p className="font-medium">{vaccine.name}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(vaccine.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}