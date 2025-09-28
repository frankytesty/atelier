import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, Users, Palette, Globe, Star, CheckCircle, Award, Heart, Zap, Shield, Crown, Gem } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-ivory-50 to-sage-50">
      {/* Modern Navigation */}
      <nav className="nav-modern fixed top-0 w-full z-50 pwa-safe-area-top">
        <div className="container-wide">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-display font-bold text-gradient">Atelier Luminform</h1>
            </div>
            <div className="hidden lg:flex items-center space-x-8">
              <a href="#features" className="text-sage-600 hover:text-gold-600 transition-colors font-medium">
                Funktionen
              </a>
              <a href="#testimonials" className="text-sage-600 hover:text-gold-600 transition-colors font-medium">
                Referenzen
              </a>
              <a href="#pricing" className="text-sage-600 hover:text-gold-600 transition-colors font-medium">
                Preise
              </a>
              <a href="#about" className="text-sage-600 hover:text-gold-600 transition-colors font-medium">
                Über uns
              </a>
              <Button variant="ghost" size="sm" className="touch-target" asChild>
                <Link href="/auth/login">Anmelden</Link>
              </Button>
              <Button className="btn-modern touch-target" asChild>
                <Link href="/auth/apply">Zugang Anfordern</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gold-200/30 rounded-full blur-3xl floating-element"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-sage-200/30 rounded-full blur-3xl floating-element" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-ivory-300/30 rounded-full blur-3xl floating-element" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="container-wide relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="fade-in-up">
              <Badge className="mb-8 glass-morphism text-gold-700 border-gold-200">
                <Gem className="w-4 h-4 mr-2" />
                Exklusive Einladungs-Plattform
              </Badge>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-charcoal-900 mb-8 text-balance leading-tight">
                <span className="text-gradient">Luxuriöse</span><br />
                <span className="text-charcoal-900">Hochzeits-</span><br />
                <span className="text-gradient">Plattform</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-sage-700 mb-12 max-w-3xl mx-auto text-pretty leading-relaxed">
                Erleben Sie die Zukunft der Hochzeitsplanung mit unserer exklusiven B2B-Plattform. 
                Kuratierte Premium-Produkte, White-Label Microsites und eine elitäre Community warten auf Sie.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12 slide-in-left">
              <Button size="lg" className="btn-modern text-lg px-12 py-4 text-lg pulse-glow" asChild>
                <Link href="/auth/apply">
                  <Crown className="mr-3 h-6 w-6" />
                  Einladung Anfordern
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-12 py-4 glass-morphism border-gold-300 text-gold-700 hover:bg-gold-50" asChild>
                <Link href="#features">
                  <Zap className="mr-3 h-6 w-6" />
                  Entdecken Sie Mehr
                </Link>
              </Button>
            </div>
            
            <div className="slide-in-right">
              <p className="text-sage-600 mb-4">
                Bereits Teil unserer exklusiven Community?
              </p>
              <Link
                href="/auth/login"
                className="inline-flex items-center text-gold-600 hover:text-gold-700 font-semibold underline underline-offset-4 transition-colors"
              >
                <Shield className="mr-2 h-4 w-4" />
                Partner Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 relative">
        <div className="container-wide">
          <div className="text-center mb-12">
            <p className="text-sage-600 mb-8 text-lg font-medium">Vertraut von führenden Hochzeitsprofis</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="modern-card p-8 text-center scale-in">
                <div className="w-16 h-16 bg-gradient-to-br from-gold-100 to-gold-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-gold-600" />
                </div>
                <h3 className="text-xl font-semibold text-charcoal-900 mb-2">Branchenführer</h3>
                <p className="text-sage-600">Von Experten für Experten entwickelt</p>
              </div>
              <div className="modern-card p-8 text-center scale-in" style={{animationDelay: '0.2s'}}>
                <div className="w-16 h-16 bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-sage-600" />
                </div>
                <h3 className="text-xl font-semibold text-charcoal-900 mb-2">Premium Qualität</h3>
                <p className="text-sage-600">Nur die besten Materialien und Handwerkskunst</p>
              </div>
              <div className="modern-card p-8 text-center scale-in" style={{animationDelay: '0.4s'}}>
                <div className="w-16 h-16 bg-gradient-to-br from-ivory-100 to-ivory-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-ivory-600" />
                </div>
                <h3 className="text-xl font-semibold text-charcoal-900 mb-2">Verifizierte Partner</h3>
                <p className="text-sage-600">Exklusive Community von Profis</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-24 relative">
        <div className="container-wide">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-display font-bold text-charcoal-900 mb-6 text-balance">
              <span className="text-gradient">Revolutionäre Tools</span><br />
              für Ihr Hochzeitsgeschäft
            </h2>
            <p className="text-xl md:text-2xl text-sage-600 max-w-3xl mx-auto leading-relaxed">
              Entdecken Sie die nächste Generation von Hochzeitsplanungs-Tools, 
              entwickelt von Experten für Experten
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Curated Catalog - Large Card */}
            <div className="lg:col-span-2 lg:row-span-2">
              <Card className="modern-card h-full gradient-border">
                <CardHeader className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-gold-100 to-gold-200 rounded-2xl flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-gold-600" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl md:text-3xl text-charcoal-900 mb-2">Kuratierter Premium-Katalog</CardTitle>
                      <CardDescription className="text-sage-600 text-lg">Exklusive Hochzeitsartikel von Weltklasse</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <p className="text-sage-700 mb-8 text-lg leading-relaxed">
                    Durchstöbern Sie unsere sorgfältig kuratierte Kollektion von Premium-Hochzeitsbedarf. 
                    Von luxuriösen Tischdekorationen bis hin zu maßgeschneiderter Beschilderung - 
                    jedes Stück ist ein Meisterwerk der Handwerkskunst.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <Badge className="glass-morphism text-gold-700 border-gold-200 p-3 text-center">Tischdekorationen</Badge>
                    <Badge className="glass-morphism text-gold-700 border-gold-200 p-3 text-center">Beschilderung</Badge>
                    <Badge className="glass-morphism text-gold-700 border-gold-200 p-3 text-center">Tischwäsche</Badge>
                    <Badge className="glass-morphism text-gold-700 border-gold-200 p-3 text-center">Beleuchtung</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* White-Label Microsites */}
            <div className="lg:col-span-1 lg:row-span-1">
              <Card className="modern-card h-full">
                <CardHeader className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-sage-100 to-sage-200 rounded-xl flex items-center justify-center">
                      <Globe className="h-6 w-6 text-sage-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-charcoal-900">White-Label Websites</CardTitle>
                      <CardDescription className="text-sage-600">Individuelle Microsites</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <p className="text-sage-700 leading-relaxed">
                    Erstellen Sie vollständig gebrandete Microsites mit Ihren kuratierten Kollektionen für jeden Kunden.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Personalization Tools */}
            <div className="lg:col-span-1 lg:row-span-1">
              <Card className="modern-card h-full">
                <CardHeader className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-ivory-100 to-ivory-200 rounded-xl flex items-center justify-center">
                      <Palette className="h-6 w-6 text-ivory-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-charcoal-900">Personalisierung</CardTitle>
                      <CardDescription className="text-sage-600">Jedes Detail anpassen</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <p className="text-sage-700 leading-relaxed">
                    Erweiterte Anpassungstools, um die Vision Ihrer Kunden perfekt umzusetzen.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Professional Network - Large Card */}
            <div className="lg:col-span-2 lg:row-span-1">
              <Card className="modern-card h-full">
                <CardHeader className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold-100 to-gold-200 rounded-xl flex items-center justify-center">
                      <Users className="h-6 w-6 text-gold-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-charcoal-900">Exklusives Profi-Netzwerk</CardTitle>
                      <CardDescription className="text-sage-600">Community von Branchenexperten</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <p className="text-sage-700 leading-relaxed">
                    Treten Sie einer exklusiven Community von erstklassigen Hochzeitsplanern, Veranstaltungsorten und
                    Event-Managern bei. Teilen Sie Erkenntnisse und arbeiten Sie an Projekten zusammen.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gradient-to-br from-sage-50 to-ivory-50">
        <div className="container-wide">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-display font-bold text-charcoal-900 mb-6 text-balance">
              <span className="text-gradient">Stimmen unserer</span><br />
              exklusiven Partner
            </h2>
            <p className="text-xl md:text-2xl text-sage-600 max-w-3xl mx-auto leading-relaxed">
              Entdecken Sie, wie Atelier Luminform das Geschäft unserer Partner revolutioniert hat
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <Card className="modern-card border-2 border-gold-200/50 hover:border-gold-300 transition-all duration-300">
              <CardHeader className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-gold-100 to-gold-200 rounded-2xl flex items-center justify-center">
                    <Heart className="h-8 w-8 text-gold-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-charcoal-900">Sarah Weber</h4>
                    <p className="text-sage-600">Hochzeitsplanerin, München</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-gold-400 text-gold-400" />
                  ))}
                </div>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <p className="text-sage-700 italic text-lg leading-relaxed">
                  "Atelier Luminform hat mein Geschäft revolutioniert. Die personalisierten Microsites beeindrucken
                  meine Kunden jedes Mal, und die Produktqualität ist unübertroffen."
                </p>
              </CardContent>
            </Card>

            <Card className="modern-card border-2 border-sage-200/50 hover:border-sage-300 transition-all duration-300">
              <CardHeader className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl flex items-center justify-center">
                    <Globe className="h-8 w-8 text-sage-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-charcoal-900">Marcus Klein</h4>
                    <p className="text-sage-600">Event-Manager, Hamburg</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-sage-400 text-sage-400" />
                  ))}
                </div>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <p className="text-sage-700 italic text-lg leading-relaxed">
                  "Die White-Label-Funktionen sind ein Game-Changer. Ich kann meinen Kunden eine vollständig gebrandete
                  Erfahrung bieten, die sie nirgendwo anders bekommen."
                </p>
              </CardContent>
            </Card>

            <Card className="modern-card border-2 border-ivory-200/50 hover:border-ivory-300 transition-all duration-300">
              <CardHeader className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-ivory-100 to-ivory-200 rounded-2xl flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-ivory-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-charcoal-900">Lisa Hoffmann</h4>
                    <p className="text-sage-600">Floristin & Dekorateur, Berlin</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-ivory-400 text-ivory-400" />
                  ))}
                </div>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <p className="text-sage-700 italic text-lg leading-relaxed">
                  "Endlich eine Plattform, die versteht, was Hochzeitsprofis brauchen. Die Personalisierungsoptionen
                  sind endlos und die Qualität ist Premium."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Erfolgsgeschichten unserer Partner
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Entdecken Sie, wie unsere Partner außergewöhnliche Hochzeiten kreieren
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <div className="text-center">
                  <Heart className="h-12 w-12 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Luxus Gartenhochzeit</p>
                </div>
              </div>
              <CardHeader>
                <CardTitle>Traumhafte Gartenhochzeit in der Toskana</CardTitle>
                <CardDescription>Sarah Weber, Hochzeitsplanerin München</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Mit Atelier Luminform konnte Sarah eine vollständig personalisierte Microsite für ihre Kunden
                  erstellen, die perfekt zur toskanischen Atmosphäre passte. Personalisierte Tischkarten, Menüs und
                  Beschilderung in warmen Erdtönen machten diese Hochzeit unvergesslich.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Personalisierte Beschilderung</Badge>
                  <Badge variant="secondary">Custom Tischdekor</Badge>
                  <Badge variant="secondary">White-Label Site</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                <div className="text-center">
                  <Globe className="h-12 w-12 text-accent mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Moderne Stadthochzeit</p>
                </div>
              </div>
              <CardHeader>
                <CardTitle>Elegante Stadthochzeit im Industriestil</CardTitle>
                <CardDescription>Marcus Klein, Event-Manager Hamburg</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Marcus nutzte unsere Plattform, um eine moderne Hochzeit in einer umgebauten Fabrik zu gestalten.
                  Minimalistische Beschilderung, industrielle Beleuchtung und personalisierte Details schufen eine
                  einzigartige Atmosphäre, die das Brautpaar begeisterte.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Industrielle Beleuchtung</Badge>
                  <Badge variant="secondary">Minimalistisches Design</Badge>
                  <Badge variant="secondary">Custom Branding</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 relative">
        <div className="container-wide">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-display font-bold text-charcoal-900 mb-6 text-balance">
              <span className="text-gradient">Exklusive Preise</span><br />
              für jeden Bedarf
            </h2>
            <p className="text-xl md:text-2xl text-sage-600 max-w-3xl mx-auto leading-relaxed">
              Wählen Sie das Premium-Paket, das perfekt zu Ihrem Hochzeitsgeschäft passt
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <Card className="modern-card border-2 border-sage-200/50 hover:border-sage-300 transition-all duration-300 relative">
              <CardHeader className="text-center p-8">
                <CardTitle className="text-3xl font-display text-charcoal-900 mb-2">Starter</CardTitle>
                <CardDescription className="text-sage-600 text-lg">Perfekt für neue Hochzeitsplaner</CardDescription>
                <div className="mt-6">
                  <span className="text-5xl font-bold text-gradient">€99</span>
                  <span className="text-sage-600 text-lg">/Monat</span>
                </div>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                <div className="flex items-center gap-4">
                  <CheckCircle className="h-6 w-6 text-gold-500" />
                  <span className="text-sage-700">Bis zu 5 Microsites</span>
                </div>
                <div className="flex items-center gap-4">
                  <CheckCircle className="h-6 w-6 text-gold-500" />
                  <span className="text-sage-700">Grundlegende Personalisierung</span>
                </div>
                <div className="flex items-center gap-4">
                  <CheckCircle className="h-6 w-6 text-gold-500" />
                  <span className="text-sage-700">Standard Produktkatalog</span>
                </div>
                <div className="flex items-center gap-4">
                  <CheckCircle className="h-6 w-6 text-gold-500" />
                  <span className="text-sage-700">E-Mail Support</span>
                </div>
                <Button className="w-full mt-8 glass-morphism border-gold-300 text-gold-700 hover:bg-gold-50" asChild>
                  <Link href="/auth/apply">Jetzt Starten</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Professional Plan - Featured */}
            <Card className="modern-card border-2 border-gold-300 relative gradient-border">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-gold-500 to-gold-600 text-white px-6 py-2 text-lg font-semibold pulse-glow">
                  <Crown className="w-4 h-4 mr-2" />
                  Beliebt
                </Badge>
              </div>
              <CardHeader className="text-center p-8 pt-12">
                <CardTitle className="text-3xl font-display text-charcoal-900 mb-2">Professional</CardTitle>
                <CardDescription className="text-sage-600 text-lg">Für etablierte Hochzeitsprofis</CardDescription>
                <div className="mt-6">
                  <span className="text-5xl font-bold text-gradient">€249</span>
                  <span className="text-sage-600 text-lg">/Monat</span>
                </div>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                <div className="flex items-center gap-4">
                  <CheckCircle className="h-6 w-6 text-gold-500" />
                  <span className="text-sage-700">Unbegrenzte Microsites</span>
                </div>
                <div className="flex items-center gap-4">
                  <CheckCircle className="h-6 w-6 text-gold-500" />
                  <span className="text-sage-700">Erweiterte Personalisierung</span>
                </div>
                <div className="flex items-center gap-4">
                  <CheckCircle className="h-6 w-6 text-gold-500" />
                  <span className="text-sage-700">Premium Produktkatalog</span>
                </div>
                <div className="flex items-center gap-4">
                  <CheckCircle className="h-6 w-6 text-gold-500" />
                  <span className="text-sage-700">Custom Domains</span>
                </div>
                <div className="flex items-center gap-4">
                  <CheckCircle className="h-6 w-6 text-gold-500" />
                  <span className="text-sage-700">Priority Support</span>
                </div>
                <Button className="w-full mt-8 btn-modern pulse-glow" asChild>
                  <Link href="/auth/apply">
                    <Crown className="w-5 h-5 mr-2" />
                    Jetzt Starten
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="modern-card border-2 border-ivory-200/50 hover:border-ivory-300 transition-all duration-300 relative">
              <CardHeader className="text-center p-8">
                <CardTitle className="text-3xl font-display text-charcoal-900 mb-2">Enterprise</CardTitle>
                <CardDescription className="text-sage-600 text-lg">Für große Agenturen und Venues</CardDescription>
                <div className="mt-6">
                  <span className="text-5xl font-bold text-gradient">€499</span>
                  <span className="text-sage-600 text-lg">/Monat</span>
                </div>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                <div className="flex items-center gap-4">
                  <CheckCircle className="h-6 w-6 text-gold-500" />
                  <span className="text-sage-700">Alles aus Professional</span>
                </div>
                <div className="flex items-center gap-4">
                  <CheckCircle className="h-6 w-6 text-gold-500" />
                  <span className="text-sage-700">White-Label Branding</span>
                </div>
                <div className="flex items-center gap-4">
                  <CheckCircle className="h-6 w-6 text-gold-500" />
                  <span className="text-sage-700">API Zugang</span>
                </div>
                <div className="flex items-center gap-4">
                  <CheckCircle className="h-6 w-6 text-gold-500" />
                  <span className="text-sage-700">Dedicated Account Manager</span>
                </div>
                <div className="flex items-center gap-4">
                  <CheckCircle className="h-6 w-6 text-gold-500" />
                  <span className="text-sage-700">24/7 Support</span>
                </div>
                <Button className="w-full mt-8 glass-morphism border-gold-300 text-gold-700 hover:bg-gold-50" asChild>
                  <Link href="/auth/apply">
                    <Shield className="w-5 h-5 mr-2" />
                    Kontakt aufnehmen
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Über Atelier Luminform</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Wir revolutionieren die Art, wie Hochzeitsprofis mit ihren Kunden arbeiten
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="text-2xl font-serif font-bold text-foreground mb-4">Unsere Mission</h3>
                <p className="text-muted-foreground mb-6">
                  Wir glauben, dass jede Hochzeit einzigartig sein sollte. Deshalb haben wir eine Plattform geschaffen,
                  die es Hochzeitsprofis ermöglicht, ihren Kunden eine vollständig personalisierte und luxuriöse
                  Erfahrung zu bieten.
                </p>
                <p className="text-muted-foreground">
                  Von der ersten Inspiration bis zur finalen Umsetzung - Atelier Luminform ist Ihr Partner für
                  außergewöhnliche Hochzeiten, die in Erinnerung bleiben.
                </p>
              </div>
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Heart className="h-16 w-16 text-primary mx-auto mb-4" />
                  <p className="text-lg font-medium text-foreground">Leidenschaft für Perfektion</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-2">Premium Qualität</h4>
                <p className="text-muted-foreground">
                  Nur die besten Materialien und Handwerkskunst für Ihre besonderen Momente.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-secondary" />
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-2">Exklusive Community</h4>
                <p className="text-muted-foreground">Vernetzen Sie sich mit den besten Hochzeitsprofis der Branche.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-accent" />
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-2">Innovation</h4>
                <p className="text-muted-foreground">
                  Modernste Technologie für zeitlose Eleganz und perfekte Ergebnisse.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
              Bereit, Ihr Hochzeitsgeschäft zu transformieren?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Treten Sie der exklusiven Community von Hochzeitsprofis bei, die bereits die Kundenerfahrung mit Atelier
              Luminform verbessern.
            </p>
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/auth/apply">
                Ihre Einladung Anfordern
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-sage-200 bg-gradient-to-br from-charcoal-900 to-charcoal-800 text-white">
        <div className="container-wide py-16">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-display font-bold text-gradient">Atelier Luminform</h3>
            </div>
            <p className="text-sage-300 mb-8 text-lg">Exklusive Hochzeits-Plattform für Profis</p>
            <div className="flex justify-center space-x-8 mb-8">
              <a href="#" className="text-sage-300 hover:text-gold-400 transition-colors font-medium">
                Datenschutz
              </a>
              <a href="#" className="text-sage-300 hover:text-gold-400 transition-colors font-medium">
                Nutzungsbedingungen
              </a>
              <a href="#" className="text-sage-300 hover:text-gold-400 transition-colors font-medium">
                Kontakt
              </a>
            </div>
            <div className="border-t border-sage-700 pt-8">
              <p className="text-sage-400 text-sm">
                © 2024 Atelier Luminform. Alle Rechte vorbehalten.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
