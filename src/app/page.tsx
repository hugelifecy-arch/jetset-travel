import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative min-h-screen">
      <Image
        src="/images/cyprus-hero.jpg"
        alt="Corporate Travel Cyprus"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <h1 className="relative z-10">Corporate Travel Management</h1>
    </section>
  );
}
