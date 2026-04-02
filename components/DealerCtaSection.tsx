export default function DealerCtaSection() {
  return (
    <section id="haendler" className="section-padding bg-cream">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            Finde{" "}
            <span className="font-accent text-pumpkin italic font-normal">
              deinen
            </span>{" "}
            MOSAROMA-Händler in{" "}
            <span className="font-accent text-pumpkin italic font-normal">
              deiner
            </span>{" "}
            Umgebung
          </h2>
          <p className="font-body text-text-gray text-base md:text-lg leading-relaxed mb-8 max-w-lg mx-auto">
            Hier geht es direkt zu unserer Händlersuche und somit einen
            Schritt näher zu deinem persönlichen MOSAROMA-Produkt. Durch
            Eingabe deiner Postleitzahl findest du die Händler in deiner
            Nähe.
          </p>
          <a href="#" className="btn-primary">
            Händlersuche
          </a>
        </div>
      </div>
    </section>
  );
}
