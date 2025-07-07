"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Activity, Clock, Loader2, Ruler, Waves } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AnalyticsService from "@/services/analytics/analyticsService";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
} from "recharts";
import { Label } from "@/components/ui/label";

interface AthleteAnalyticsTabContentProps {
    athleteId: number;
}

export default function AthleteAnalyticsTabContent({
    athleteId,
}: AthleteAnalyticsTabContentProps) {
    /* Tabs state */
    const [activeTab, setActiveTab] = useState<"times" | "weight" | "load">("times");

    /* Controls for time evolution */
    const [months, setMonths] = useState<number>(3);
    const [distance, setDistance] = useState<number>(100);
    const [swimStyle, setSwimStyle] = useState<string>("freestyle");

    /* Queries */
    const {
        data: timeEvolution,
        isLoading: timeLoading,
    } = useQuery({
        queryKey: ["timeEvolution", athleteId, months, distance, swimStyle],
        queryFn: () =>
            AnalyticsService.getTimeEvolution(
                athleteId,
                distance,
                swimStyle,
                months
            ),
        enabled: activeTab === "times",
    });

    const { data: metrics, isLoading: metricsLoading } = useQuery({
        queryKey: ["timeSeriesMetrics", athleteId],
        queryFn: () => AnalyticsService.getTimeSeriesMetrics(athleteId),
        enabled: activeTab === "weight",
    });

    const { data: loadVolume, isLoading: loadLoading } = useQuery({
        queryKey: ["loadVolume", athleteId],
        queryFn: () => AnalyticsService.getLoadAndVolume(athleteId),
        enabled: activeTab === "load",
    });

    const loading = timeLoading || metricsLoading || loadLoading;

    return (
        <Card className="w-full p-0">
            <CardHeader className="flex flex-col gap-4 pt-6">
                <CardTitle className="text-xl">Analíticas del atleta</CardTitle>

                {/* Conditional controls per tab */}
                <div className="w-full grid grid-cols-3 gap-4">
                    {activeTab === "times" && (
                        <>
                            {/* Meses */}
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <Clock size={16} />
                                    <Label className="font-medium">Meses</Label>
                                </div>
                                <Select
                                    value={String(months)}
                                    onValueChange={(val) => setMonths(Number(val))}
                                >
                                    <SelectTrigger className="w-36">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[3, 6, 12].map((m) => (
                                            <SelectItem key={m} value={String(m)}>
                                                Últimos {m} meses
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Distancia */}
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <Ruler size={16} />
                                    <Label className="font-medium">Distancia</Label>
                                </div>
                                <Select
                                    value={String(distance)}
                                    onValueChange={(val) => setDistance(Number(val))}
                                >
                                    <SelectTrigger className="w-36">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[100, 200, 400, 800, 1500].map((d) => (
                                            <SelectItem key={d} value={String(d)}>
                                                {d} m
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Estilo */}
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <Waves size={16} />
                                    <Label className="font-medium">Estilo</Label>
                                </div>
                                <Select
                                    value={swimStyle}
                                    onValueChange={(val) => setSwimStyle(val)}
                                >
                                    <SelectTrigger className="w-36">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[
                                            ["freestyle", "Libre"],
                                            ["backstroke", "Costas"],
                                            ["breaststroke", "Pecho"],
                                            ["butterfly", "Mariposa"],
                                            ["medley", "Medley"],
                                        ].map(([value, label]) => (
                                            <SelectItem key={value} value={value}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </>
                    )}
                    {/* Placeholder divs to maintain grid layout on other tabs */}
                    {activeTab !== "times" && <div />}
                    {activeTab !== "times" && <div />}
                    {activeTab !== "times" && <div />}
                </div>
            </CardHeader>

            <CardContent className="pt-2">
                <Tabs
                    value={activeTab}
                    onValueChange={(val) => setActiveTab(val as any)}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="times">Tiempos</TabsTrigger>
                        <TabsTrigger value="weight">Peso / FC</TabsTrigger>
                        <TabsTrigger value="load">Carga</TabsTrigger>
                    </TabsList>

                    {/* Tiempos */}
                    <TabsContent value="times">
                        {loading ? (
                            <div className="flex justify-center p-8">
                                <Loader2 className="animate-spin" />
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={350}>
                                <LineChart data={timeEvolution || []}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(v) => new Date(v).toLocaleDateString()}
                                    />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(val: number) => `${val.toFixed(2)} s`}
                                        labelFormatter={(label) =>
                                            new Date(label).toLocaleDateString()
                                        }
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="timeSeconds"
                                        dot={false}
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </TabsContent>

                    {/* Peso / FC */}
                    <TabsContent value="weight" className="">
                        {loading ? (
                            <div className="flex justify-center p-8">
                                <Loader2 className="animate-spin" />
                            </div>
                        ) : (
                            <div className="flex flex-col ">
                                {/* Peso */}
                                <section className="flex flex-col items-center gap-2">
                                    <Label className="font-semibold">Peso</Label>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <AreaChart data={metrics || []}>
                                            <defs>
                                                <linearGradient
                                                    id="weightGradient"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1"
                                                >
                                                    <stop offset="5%" stopOpacity={0.8} />
                                                    <stop offset="95%" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="date"
                                                tickFormatter={(v) => new Date(v).toLocaleDateString()}
                                            />
                                            <YAxis />
                                            <Tooltip
                                                formatter={(val: number) => `${val.toFixed(1)} kg`}
                                                labelFormatter={(label) =>
                                                    new Date(label).toLocaleDateString()
                                                }
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="weight"
                                                name="Peso (kg)"
                                                fillOpacity={1}
                                                fill="url(#weightGradient)"
                                                strokeWidth={2}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>

                                </section>

                                <section className=" flex flex-col items-center gap-2 w-full">
                                    {/* FC reposo */}
                                    <Label className="font-semibold">FC reposo</Label>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={metrics || []}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="date"
                                                tickFormatter={(v) => new Date(v).toLocaleDateString()}
                                            />
                                            <YAxis />
                                            <Tooltip
                                                formatter={(val: number) => `${val} bpm`}
                                                labelFormatter={(label) =>
                                                    new Date(label).toLocaleDateString()
                                                }
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="hrRest"
                                                name="FC reposo"
                                                dot={false}
                                                strokeWidth={2}
                                                stroke="#10b981"
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </section>
                            </div>
                        )}
                    </TabsContent>

                    {/* Carga */}
                    <TabsContent value="load">
                        {loading ? (
                            <div className="flex justify-center p-8">
                                <Loader2 className="animate-spin" />
                            </div>
                        ) : (
                            <div className="flex flex-col">

                                <section className="flex flex-col items-center gap-2">
                                    <Label className="font-semibold">Minutos semanales</Label>
                                    <ResponsiveContainer width="100%" height={350}>
                                        <BarChart data={loadVolume?.weeklyDuration || []}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="week" />
                                            <YAxis />
                                            <Tooltip
                                                formatter={(val: number) => `${val} min`}
                                                labelFormatter={(label) => `Semana ${label}`}
                                            />
                                            <Bar dataKey="minutes" barSize={30} name="Minutos" fill="#10b981" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </section>

                                <section className="flex flex-col items-center gap-2">
                                    {/* Distancia semanales */}
                                    <Label className="font-semibold">Distancia semanales</Label>
                                    <ResponsiveContainer width="100%" height={350}>
                                        <BarChart data={loadVolume?.weeklyDistance || []}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="week" />
                                            <YAxis />
                                            <Tooltip
                                                formatter={(val: number) => `${val} m`}
                                                labelFormatter={(label) => `Semana ${label}`}
                                            />
                                            <Bar dataKey="meters" barSize={30} name="Distancia (metros)" fill="#3b82f6" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </section>


                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
