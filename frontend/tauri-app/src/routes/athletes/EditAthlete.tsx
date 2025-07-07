import { AthleteForm } from '../../components/athletes/AthleteForm';

export const EditAthlete = () => {

  return (
    <div className="space-y-6">
      <AthleteForm isEditing={true} />
    </div>
  );
};

export default EditAthlete;
