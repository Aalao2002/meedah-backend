import React from 'react';

function About() {
    return (
        <div className="bg-[#FBF3EA] text-[#2B211D]">

            {/* Hero */}
            <section className="relative overflow-hidden rounded-xl mb-4">
                <div className="bg-[#6B2737] px-6 py-14 md:py-20">
                    {/* subtle texture */}
                    <div
                        className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{
                            backgroundImage:
                                'radial-gradient(circle, #F5D9C0 1px, transparent 1px)',
                            backgroundSize: '18px 18px',
                        }}
                    />
                    <div className="relative max-w-2xl">
                        <p className="text-[#E8B4A2] text-sm mb-3">Meedah Cakes</p>
                        <h1 className="font-serif text-3xl md:text-5xl leading-tight text-[#FBF3EA]">
                            Every celebration deserves a cake worth remembering.
                        </h1>
                        <p className="mt-5 text-[#F1D9D0] text-base leading-relaxed">
                            We're a small cake studio that bakes from scratch, every time.
                            No shortcuts, no mixes — just real butter, real fruit, and a
                            lot of care, whether it's a birthday, a wedding, or just
                            because.
                        </p>
                    </div>
                </div>
            </section>

            {/* Story */}
            <section className="grid md:grid-cols-5 gap-8 py-10 px-2 md:px-4">
                <div className="md:col-span-2">
                    <div className="rounded-xl h-56 md:h-full bg-[#E8B4A2]" />
                </div>
                <div className="md:col-span-3 flex flex-col justify-center">
                    <h2 className="font-serif text-2xl md:text-3xl mb-4">
                        How it started
                    </h2>
                    <p className="text-[#4A3B35] leading-relaxed mb-3">
                        Meedah Cakes began in a home kitchen with one simple goal:
                        make cakes that actually taste as good as they look. What
                        started as birthday orders for friends turned into a studio
                        that now bakes for hundreds of celebrations a year.
                    </p>
                    <p className="text-[#4A3B35] leading-relaxed">
                        Every cake is made to order, sized and flavoured around the
                        person it's for — because a cake made for someone should
                        feel like it was made for them.
                    </p>
                </div>
            </section>

            {/* What sets us apart */}
            <section className="py-10 px-2 md:px-4">
                <h2 className="font-serif text-2xl md:text-3xl mb-8">
                    What you can expect
                </h2>
                <div className="grid sm:grid-cols-3 gap-6">
                    {[
                        {
                            title: 'Baked to order',
                            body: 'Nothing sits in a freezer. Your cake is baked within days of your event, not weeks before.',
                        },
                        {
                            title: 'Ingredients you can pronounce',
                            body: 'Real butter, real cream, real fruit. We skip the preservatives and the shortcuts.',
                        },
                        {
                            title: 'Designed around you',
                            body: 'Tell us the flavour, the occasion, the vibe — we build the design from there, not the other way round.',
                        },
                    ].map((item) => (
                        <div
                            key={item.title}
                            className="border-t-2 border-[#C89B3C] pt-4"
                        >
                            <h3 className="font-medium text-lg mb-2">{item.title}</h3>
                            <p className="text-sm text-[#4A3B35] leading-relaxed">
                                {item.body}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Stats */}
            <section className="bg-[#2B211D] rounded-xl mt-4 px-6 py-10 grid grid-cols-3 gap-4 text-center">
                {[
                    { number: '5+', label: 'Years baking' },
                    { number: '800+', label: 'Cakes delivered' },
                    { number: '100%', label: 'Made from scratch' },
                ].map((stat) => (
                    <div key={stat.label}>
                        <p className="font-serif text-2xl md:text-4xl text-[#F1D9D0]">
                            {stat.number}
                        </p>
                        <p className="text-xs md:text-sm text-[#C9A88A] mt-1">
                            {stat.label}
                        </p>
                    </div>
                ))}
            </section>
        </div>
    );
}

export default About;