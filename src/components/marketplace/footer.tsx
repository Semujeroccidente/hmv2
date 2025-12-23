import Link from 'next/link'

export function Footer() {
    return (
        <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 mt-auto border-t border-gray-800 dark:border-gray-900">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-bold text-lg mb-4">HonduMarket</h3>
                        <p className="text-gray-400 dark:text-gray-500">
                            El marketplace más grande de Honduras para comprar, vender y participar en subastas.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Empresa</h3>
                        <ul className="space-y-2 text-gray-400 dark:text-gray-500">
                            <li><Link href="/about" className="hover:text-white dark:hover:text-gray-200 transition-colors">Sobre nosotros</Link></li>
                            <li><Link href="/carreras" className="hover:text-white dark:hover:text-gray-200 transition-colors">Carreras</Link></li>
                            <li><Link href="/prensa" className="hover:text-white dark:hover:text-gray-200 transition-colors">Prensa</Link></li>
                            <li><Link href="/blog" className="hover:text-white dark:hover:text-gray-200 transition-colors">Blog</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Soporte</h3>
                        <ul className="space-y-2 text-gray-400 dark:text-gray-500">
                            <li><Link href="/ayuda" className="hover:text-white dark:hover:text-gray-200 transition-colors">Centro de ayuda</Link></li>
                            <li><Link href="/contacto" className="hover:text-white dark:hover:text-gray-200 transition-colors">Contacto</Link></li>
                            <li><Link href="/terminos" className="hover:text-white dark:hover:text-gray-200 transition-colors">Términos y condiciones</Link></li>
                            <li><Link href="/privacidad" className="hover:text-white dark:hover:text-gray-200 transition-colors">Privacidad</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Síguenos</h3>
                        <ul className="space-y-2 text-gray-400 dark:text-gray-500">
                            <li><a href="#" className="hover:text-white dark:hover:text-gray-200 transition-colors">Facebook</a></li>
                            <li><a href="#" className="hover:text-white dark:hover:text-gray-200 transition-colors">Instagram</a></li>
                            <li><a href="#" className="hover:text-white dark:hover:text-gray-200 transition-colors">Twitter</a></li>
                            <li><a href="#" className="hover:text-white dark:hover:text-gray-200 transition-colors">LinkedIn</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 dark:border-gray-900 mt-8 pt-8 text-center text-gray-400 dark:text-gray-500">
                    <p>&copy; {new Date().getFullYear()} HonduMarket. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    )
}
