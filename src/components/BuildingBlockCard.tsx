import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { BuildingBlock } from '../data/buildingBlocks';
import { useLanguage } from '../contexts/LanguageContext';

interface BuildingBlockCardProps {
  block: BuildingBlock;
}

const BuildingBlockCard: React.FC<BuildingBlockCardProps> = ({ block }) => {
  const { t } = useLanguage();
  
  // Dynamically get the icon component
  const IconComponent = (Icons as any)[block.icon] || Icons.Box;
  
  // Determine background color based on category
  let bgColor = 'bg-primary-pastel';
  let iconBgColor = 'bg-primary-main';
  let textColor = 'text-primary-main';
  
  if (block.category === 'Dados e Analytics') {
    bgColor = 'bg-accent-bluePastel';
    iconBgColor = 'bg-accent-blue';
    textColor = 'text-accent-blueText';
  } else if (block.category === 'Operações Financeiras') {
    bgColor = 'bg-accent-yellowPastel';
    iconBgColor = 'bg-accent-yellow';
    textColor = 'text-accent-yellowText';
  } else if (block.category === 'Segurança e Compliance') {
    bgColor = 'bg-accent-orangePastel';
    iconBgColor = 'bg-accent-orange';
    textColor = 'text-accent-orangeText';
  }
  
  return (
    <div className={`${bgColor} rounded-lg p-6 shadow-soft hover:shadow-hover transition-shadow h-full flex flex-col`}>
      <div className="flex items-center mb-4">
        <div className={`${iconBgColor} p-3 rounded-full`}>
          <IconComponent className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold ml-3 text-gray-900">{block.title}</h3>
      </div>
      <p className="text-gray-700 flex-grow">{block.short_description}</p>
      <Link to={`/building-blocks/${block.id}`} className={`flex items-center mt-4 ${textColor} font-medium hover:underline`}>
        {t('blocks.more')} <ChevronRight className="h-4 w-4 ml-1" />
      </Link>
    </div>
  );
};

export default BuildingBlockCard;