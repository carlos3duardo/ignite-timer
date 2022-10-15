import { ThemeProvider } from 'styled-components';
import { Button } from './components/Button'
import { defaultTheme } from './styles/themes/default';

function App() {

  return (
    <ThemeProvider theme={defaultTheme}>
      <Button scheme="primary" />
      <Button scheme="secondary" />
      <Button scheme="danger" />
      <Button scheme="success" />
      <Button />
    </ThemeProvider>
  )
}

export default App
