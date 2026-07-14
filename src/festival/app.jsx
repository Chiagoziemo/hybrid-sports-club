/* global React, ReactDOM */
function FestivalApp() {
  window.useReveal();
  const { FestivalHeader, FestivalHero, Highlights, Itinerary, RegisterForm, Partner, Support, SiteFooter } = window;
  return (
    <React.Fragment>
      <FestivalHeader />
      <FestivalHero />
      <Highlights />
      <Itinerary />
      <RegisterForm />
      <Partner />
      <Support />
      <SiteFooter />
    </React.Fragment>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<FestivalApp />);
