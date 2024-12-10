const { render, screen } = require('@testing-library/react');
const App = require('./App');
const Chat =   require('./pages/dashboards/Chat.jsx');

test('renders learn react link', () => {
  render(<Chat />);
  const linkElement = screen.getByText("Default Content");
  expect(linkElement).toBeInTheDocument();
});