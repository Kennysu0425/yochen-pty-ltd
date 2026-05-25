export default function Home() {
  const year = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-white text-neutral-900 flex flex-col">
      <header className="px-6 py-5 border-b border-neutral-200">
        <div className="mx-auto max-w-3xl flex items-center justify-between">
          <span className="text-sm font-medium tracking-wider">
            YOCHEN PTY LTD
          </span>
          <a
            href="mailto:contact@yochen.com.au"
            className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            contact@yochen.com.au
          </a>
        </div>
      </header>

      <section className="flex-1 px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
            Yochen Pty Ltd
          </h1>
          <p className="mt-6 text-lg text-neutral-600 leading-relaxed max-w-2xl">
            An Australian private company building software for the
            Asia-Pacific region.
          </p>

          <div className="mt-16 grid gap-10 sm:grid-cols-2">
            <div>
              <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-widest">
                Registered office
              </h2>
              <p className="mt-3 text-neutral-800">Australia</p>
            </div>
            <div>
              <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-widest">
                Contact
              </h2>
              <p className="mt-3">
                <a
                  href="mailto:contact@yochen.com.au"
                  className="text-neutral-800 underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-900 transition-colors"
                >
                  contact@yochen.com.au
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="px-6 py-6 border-t border-neutral-200">
        <div className="mx-auto max-w-3xl text-xs text-neutral-500">
          © {year} Yochen Pty Ltd. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
