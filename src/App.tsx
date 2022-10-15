import { ThemeProvider } from 'styled-components';
import { Button } from './components/Button'

import { GlobalStyle } from './styles/themes/global';
import { defaultTheme } from './styles/themes/default';

function App() {

  return (
    <ThemeProvider theme={defaultTheme}>
      <Button scheme="primary" />
      <Button scheme="secondary" />
      <Button scheme="danger" />
      <Button scheme="success" />
      <Button />

      <GlobalStyle />
    </ThemeProvider>
  )
}

export default App
