import Link from 'next/link'

export function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-12 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-bold text-lg mb-4">HonduMarket</h3>
                        <p className="text-gray-400">
                            El marketplace más grande de Honduras para comprar, vender y participar en subastas.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Empresa</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link href="/about" className="hover:text-white">Sobre nosotros</Link></li>
                            <li><Link href="/carreras" className="hover:text-white">Carreras</Link></li>
                            <li><Link href="/prensa" className="hover:text-white">Prensa</Link></li>
                            <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Soporte</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link href="/ayuda" className="hover:text-white">Centro de ayuda</Link></li>
                            <li><Link href="/contacto" className="hover:text-white">Contacto</Link></li>
                            <li><Link href="/terminos" className="hover:text-white">Términos y condiciones</Link></li>
                            <li><Link href="/privacidad" className="hover:text-white">Privacidad</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Síguenos</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-white">Facebook</a></li>
                            <li><a href="#" className="hover:text-white">Instagram</a></li>
                            <li><a href="#" className="hover:text-white">Twitter</a></li>
                            <li><a href="#" className="hover:text-white">LinkedIn</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} HonduMarket. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    )
}
