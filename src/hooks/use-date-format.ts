
export const useDateFormat = () => {
  const formatDate = (isoString: string, options?: Intl.DateTimeFormatOptions) => {
    if (!isoString) return '';
    
    const date = new Date(isoString);
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    
    return date.toLocaleDateString('en-US', options || defaultOptions);
  };
  
  const formatDateShort = (isoString: string) => {
    if (!isoString) return '';
    
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };
  
  const formatDateTime = (isoString: string) => {
    if (!isoString) return '';
    
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return { 
    formatDate,
    formatDateShort,
    formatDateTime
  };
};
