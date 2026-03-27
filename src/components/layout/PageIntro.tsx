import { ReactNode } from 'react';
import '../../styles/page-intro.css';

interface PageIntroProps {
  title: string;
  description?: string;
  action?: ReactNode;
  eyebrow?: ReactNode;
}

export default function PageIntro({ title, description, action, eyebrow }: PageIntroProps) {
  return (
    <div className="page-intro">
      <div className="page-intro__row">
        <div>
          {eyebrow ? <div className="page-intro__eyebrow">{eyebrow}</div> : null}
          <h1 className="page-intro__title">{title}</h1>
          {description ? <p className="page-intro__description">{description}</p> : null}
        </div>
        {action ? <div className="page-intro__action">{action}</div> : null}
      </div>
    </div>
  );
}
