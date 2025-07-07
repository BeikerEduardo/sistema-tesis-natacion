import { Cloud, CloudOff, CloudRain, Droplet, HelpCircle, Sun, Thermometer } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";


// Weather utility functions
const WeatherIcon = ({ condition }: { condition: string | undefined }) => {
    if (!condition) return <CloudOff className="h-6 w-6" />;

    switch (condition.toLowerCase()) {
        case 'sunny':
            return <Sun className="h-6 w-6 text-yellow-500" />;
        case 'cloudy':
            return <Cloud className="h-6 w-6 text-gray-400" />;
        case 'rainy':
            return <CloudRain className="h-6 w-6 text-blue-400" />;
        default:
            return <HelpCircle className="h-6 w-6 text-gray-500" />;
    }
};

const getWeatherText = (condition: string | undefined) => {
    if (!condition) return 'Desconocido';

    switch (condition.toLowerCase()) {
        case 'sunny':
            return 'Soleado';
        case 'cloudy':
            return 'Nublado';
        case 'rainy':
            return 'Lluvia';
        default:
            return 'Desconocido';
    }
};

export type TrainingDetailWeatherCardProps = {
    weather: {
        conditions: string;
        temperature: number;
        humidity: number;
        isOutdoor: boolean;
    }
};

const TrainingDetailWeatherCard = ({ weather }: TrainingDetailWeatherCardProps) => {
    return (
        <>
            {/* Condiciones climáticas */}
            <Card>
                <CardHeader>
                    <CardTitle>Condiciones climáticas</CardTitle>
                    <CardDescription>
                        Pronóstico para la sesión
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="text-5xl">
                            {weather && <WeatherIcon condition={weather.conditions} />}
                        </div>
                        <div className="text-right">
                            <div className="flex items-center justify-end gap-2">
                                <Thermometer className="h-5 w-5 text-red-500" />
                                <p className="text-2xl font-bold">{weather?.temperature || 0}°C</p>
                            </div>
                            <p className="text-muted-foreground capitalize">{weather && getWeatherText(weather.conditions).toLowerCase()}</p>
                            <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
                                <Droplet className="h-4 w-4 text-blue-500" />
                                <span>Humedad: {weather?.humidity || 0}%</span>
                            </div>
                            <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mt-1">
                                {weather?.isOutdoor ? (
                                    <>
                                        <Sun className="h-4 w-4 text-yellow-500" />
                                        <span>Al aire libre</span>
                                    </>
                                ) : (
                                    <>
                                        <Cloud className="h-4 w-4 text-gray-500" />
                                        <span>En piscina cubierta</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
};

export default TrainingDetailWeatherCard;