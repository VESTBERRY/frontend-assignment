import { ApolloProvider } from "@apollo/client";
import styled, {
  createGlobalStyle,
  ThemeProvider,
} from "npm:styled-components";
import theme from "./theme.ts";
import LogoSvg from "../assets/vestberry-logo.svg?react";

import client from "./apollo.ts";
import Page from "./Page.tsx";

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    color: ${theme.colors.text};
    font-size: 14px;
    font-family: 'Be Vietnam Pro', sans-serif;
    background-color: ${theme.colors.bg};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

const Logo = styled(LogoSvg)`
  height: 10px;
`;

const Header = styled.header`
  padding: 20px;
`;

function App() {
  return (
    <div className="App">
      <GlobalStyles />
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <Header>
            <Logo />
          </Header>
          <Page />
        </ThemeProvider>
      </ApolloProvider>
    </div>
  );
}

export default App;
