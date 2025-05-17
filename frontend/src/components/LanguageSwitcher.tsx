import React from 'react';
import { useTranslation } from 'react-i18next';
import { Select, MenuItem, SelectChangeEvent } from '@mui/material';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'rw', name: 'Kinyarwanda' },
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' }
  ];

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const langCode = event.target.value;
    i18n.changeLanguage(langCode);
  };

  return (
    <Select
      value={i18n.language}
      onChange={handleLanguageChange}
      size="small"
      sx={{
        backgroundColor: 'transparent',
        color: 'white',
        '.MuiOutlinedInput-notchedOutline': { border: 'none' },
        '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
        '& .MuiSelect-icon': { color: 'white' },
        '& .MuiSelect-select': { py: 1, px: 2 }
      }}
      MenuProps={{
        PaperProps: {
          sx: {
            maxHeight: 200,
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1
            }
          }
        }
      }}
    >
      {languages.map((lang) => (
        <MenuItem key={lang.code} value={lang.code}>
          {lang.name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default LanguageSwitcher; 