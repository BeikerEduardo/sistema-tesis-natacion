import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { TrainingForm } from '@/components/trainings/TrainingForm';

export const NewTraining = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="h-8 w-8" 
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Nuevo Entrenamiento</h1>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <TrainingForm 
          onSuccess={() => navigate('/trainings')} 
        />
      </div>
    </div>
  );
};

export default NewTraining;
