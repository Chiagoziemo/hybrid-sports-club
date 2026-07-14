/* global React, ReactDOM */
function App() {
  window.useReveal();
  const { Nav, Hero, Ticker, About, Benefits, Events, Join, Gallery, Collabs, Testimonials, Sponsors, SiteFooter, RsvpModal } = window;
  return (
    <React.Fragment>
      <Nav data-comment-anchor="8749eeff29-a-32-11" />
      <Hero />
      <Ticker />
      <About />
      <Benefits data-comment-anchor="74b57f9582-div-25-19" />
      <Events />
      <Join />
      <Gallery />
      <Collabs />
      <Testimonials />
      <Sponsors />
      <SiteFooter data-comment-anchor="3747b81d41-div-29-19" />
      <RsvpModal />
    </React.Fragment>);

}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
