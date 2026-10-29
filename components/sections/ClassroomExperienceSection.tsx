import { MessageCircle, Users2, MonitorPlay } from 'lucide-react'

const experiences = [
  {
    icon: MessageCircle,
    title: 'Real questions',
    description: 'Students ask what you would have asked — pricing, clients, mistakes — and you hear the full answer.',
  },
  {
    icon: Users2,
    title: 'Real conversations',
    description: 'The discussions, debates and follow-ups that make a live class valuable are all captured on the recording.',
  },
  {
    icon: MonitorPlay,
    title: 'Real work, on screen',
    description: 'You watch actual projects being built and campaigns being run, not rehearsed demos.',
  },
]

export function ClassroomExperienceSection() {
  return (
    <section className="section-padding py-16 md:py-24">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-elevated bg-secondary/30 flex items-center justify-center order-2 lg:order-1">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-3">
                <MonitorPlay className="w-10 h-10 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">A practical Learn2Earn class in session</p>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <p className="heading-accent">The classroom experience</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-secondary mb-6">
              Recorded classes that still feel live.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Most of our classes are recorded with a real cohort in the room. When you press play, you are not watching slides read aloud — you are sitting in the class. You hear the questions students actually asked, the conversations that followed, and the answers that came from working through real problems together.
            </p>
            <div className="space-y-6">
              {experiences.map((exp) => (
                <div key={exp.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <exp.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-secondary mb-1">{exp.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
