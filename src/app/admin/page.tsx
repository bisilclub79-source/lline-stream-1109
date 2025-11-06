import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Film, Users, CreditCard } from "lucide-react";
import PageHeader from "./components/page-header";

export default function AdminDashboardPage() {
  const stats = [
    { title: "Total Revenue", value: "$45,231.89", icon: DollarSign, change: "+20.1% from last month" },
    { title: "Subscriptions", value: "+2350", icon: CreditCard, change: "+180.1% from last month" },
    { title: "Total Users", value: "12,234", icon: Users, change: "+19% from last month" },
    { title: "Videos Hosted", value: "573", icon: Film, change: "+2 from last month" },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" description="An overview of your platform's performance." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Activity feed will be displayed here.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
