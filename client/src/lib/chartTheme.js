export const chartColors = {
  primary: '#0f5132',
  primarySoft: '#27a36a',
  accent: '#71c49a',
  palette: ['#0f5132', '#27a36a', '#e7a94b', '#547b9a', '#a2bcad', '#cc785b', '#8474a1'],
};

export function getChartTheme(isDark) {
  return {
    text: isDark ? '#d6e2dc' : '#33473d',
    muted: isDark ? '#91a59a' : '#738177',
    axis: isDark ? '#405148' : '#dfe6e0',
    grid: isDark ? '#26352d' : '#edf1ed',
    surface: isDark ? '#17221b' : '#ffffff',
    border: isDark ? '#34443a' : '#e2e9e3',
  };
}

export function getChartTooltip(isDark) {
  const theme = getChartTheme(isDark);
  return {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderWidth: 1,
    textStyle: { color: theme.text, fontSize: 12 },
    extraCssText: 'box-shadow: 0 12px 32px rgba(10, 30, 18, .14); border-radius: 10px; padding: 10px 12px;',
  };
}
