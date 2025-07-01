import React from 'react';

const StatCard = ({ 
  title, 
  value, 
  trend, 
  icon, 
  color = 'purple',
  loading = false
}) => {
  // Configuration des couleurs
  const colorConfig = {
    purple: {
      gradient: 'from-purple-600 to-purple-400',
      trendPositive: 'bg-purple-100/20 text-purple-50',
      trendNegative: 'bg-purple-900/20 text-purple-100'
    },
    blue: {
      gradient: 'from-blue-600 to-blue-400',
      trendPositive: 'bg-blue-100/20 text-blue-50',
      trendNegative: 'bg-blue-900/20 text-blue-100'
    },
    green: {
      gradient: 'from-green-600 to-green-400',
      trendPositive: 'bg-green-100/20 text-green-50',
      trendNegative: 'bg-green-900/20 text-green-100'
    },
    orange: {
      gradient: 'from-orange-600 to-orange-400',
      trendPositive: 'bg-orange-100/20 text-orange-50',
      trendNegative: 'bg-orange-900/20 text-orange-100'
    },
    pink: {
      gradient: 'from-pink-600 to-pink-400',
      trendPositive: 'bg-pink-100/20 text-pink-50',
      trendNegative: 'bg-pink-900/20 text-pink-100'
    }
  };

  // Style conditionnel pour la tendance
  const trendStyle = trend?.startsWith('+') 
    ? colorConfig[color].trendPositive 
    : colorConfig[color].trendNegative;

  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${colorConfig[color].gradient} text-white shadow-lg hover:shadow-xl transition-all duration-300 h-full`}>
      {/* Effet de cercle décoratif */}
      <div className="absolute -right-10 -top-10 opacity-10">
        <svg width="120" height="120" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="50" fill="white" />
        </svg>
      </div>
      
      {/* Contenu principal */}
      <div className="p-5 relative z-10 h-full flex flex-col">
        <div className="flex justify-between items-start flex-grow">
          <div className="flex-1">
            <p className="text-sm font-medium opacity-90 mb-2">{title}</p>
            
            {loading ? (
              <div className="h-8 bg-white/10 rounded animate-pulse w-3/4 mb-3"></div>
            ) : (
              <h2 className="text-3xl font-bold mb-3">{value}</h2>
            )}
            
            {trend && (
              <div className="flex items-center mt-auto">
                <span className={`text-xs px-2.5 py-1 rounded-full ${trendStyle} backdrop-blur-sm flex items-center`}>
                  {trend.startsWith('+') ? (
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  {trend.replace('+', '')}
                </span>
                <span className="text-xs opacity-70 ml-2">vs période précédente</span>
              </div>
            )}
          </div>
          
          {/* Icône */}
          <div className={`bg-white/20 p-3 rounded-full backdrop-blur-sm flex-shrink-0 ${loading ? 'opacity-50' : ''}`}>
            {loading ? (
              <div className="w-5 h-5"></div>
            ) : (
              <span className="text-xl">{icon}</span>
            )}
          </div>
        </div>
      </div>
      
      {/* Effet de brillance au hover */}
      <div className="absolute inset-0 opacity-0 hover:opacity-10 transition-opacity duration-300 pointer-events-none">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
      </div>
    </div>
  );
};

export default StatCard;