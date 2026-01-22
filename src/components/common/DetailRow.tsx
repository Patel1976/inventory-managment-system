import { ReactNode } from 'react';

interface DetailRowProps {
  label: string;
  value: ReactNode;
  className?: string;
}

const DetailRow = ({ label, value, className = '' }: DetailRowProps) => {
  return (
    <div className={`row mb-2 ${className}`}>
      <div className="col-4">
        <strong className="text-muted">{label}:</strong>
      </div>
      <div className="col-8">
        {value}
      </div>
    </div>
  );
};

export default DetailRow;
