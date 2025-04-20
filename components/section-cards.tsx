import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SectionCards() {
  const data = [
    {
      description: "Total Cars",
      value: "2,340",
      trend: "+8%",
      icon: <IconTrendingUp />,
      actionText: "Inventory increased",
      footerNote: "Compared to last quarter",
      trendIcon: <IconTrendingUp className="size-4" />,
    },
    {
      description: "Test Drives",
      value: "1,123",
      trend: "-10%",
      icon: <IconTrendingDown />,
      actionText: "Fewer test drives",
      footerNote: "Needs marketing push",
      trendIcon: <IconTrendingDown className="size-4" />,
    },
    {
      description: "Conversion Rate",
      value: "38%",
      trend: "+5%",
      icon: <IconTrendingUp />,
      actionText: "Sales efficiency improved",
      footerNote: "Higher close rates",
      trendIcon: <IconTrendingUp className="size-4" />,
    },
    {
      description: "Cars Sold",
      value: "894",
      trend: "+12%",
      icon: <IconTrendingUp />,
      actionText: "Strong sales performance",
      footerNote: "Best month this year",
      trendIcon: <IconTrendingUp className="size-4" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {data.map((card, i) => (
        <Card
          key={i}
          className="@container/card data-[slot=card]:bg-gradient-to-t data-[slot=card]:from-primary/5 data-[slot=card]:to-card data-[slot=card]:shadow-xs dark:data-[slot=card]:bg-card"
        >
          <CardHeader>
            <CardDescription>{card.description}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {card.value}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                {card.icon} {card.trend}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {card.actionText} {card.trendIcon}
            </div>
            <div className="text-muted-foreground">{card.footerNote}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
