import { ReactNode } from 'react';
import { cn } from '../ui/utils';
import '../../styles/surface-card.css';

interface SurfaceCardProps {
  children: ReactNode;
  className?: string;
}

export default function SurfaceCard({ children, className }: SurfaceCardProps) {
  return <section className={cn('surface-card', className)}>{children}</section>;
}
