// Ant Design theme configuration

import type { ThemeConfig } from 'antd';

// Main primary color: #835101 (from tailwind.config.ts)
// Secondary color: #B49057 (from tailwind.config.ts)

const theme: ThemeConfig = {
  token: {
    colorPrimary: '#835101',
    colorLink: '#835101',
    colorLinkHover: '#B49057',
    borderRadius: 4,
  },
  components: {
    Button: {
      colorPrimary: '#835101',
      algorithm: true,
    },
    Select: {
      colorPrimary: '#835101',
      colorBorder: '#D0BEA0',
      colorPrimaryHover: '#B49057',
      controlOutline: 'rgba(131, 81, 1, 0.2)', // Lighter version of the primary color
    },
    DatePicker: {
      colorPrimary: '#835101',
      colorBorder: '#D0BEA0',
      colorPrimaryHover: '#B49057',
    },
    Input: {
      colorPrimary: '#835101',
      colorBorder: '#D0BEA0',
      colorPrimaryHover: '#B49057',
      activeBorderColor: '#835101',
      hoverBorderColor: '#B49057',
    },
  },
};

export default theme;