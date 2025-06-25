
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqData = [
    {
        question: "What is Imagen Max BrainAi?",
        answer: "Imagen Max BrainAi is a state-of-the-art AI image generation platform that allows you to turn text descriptions into high-quality, unique images in a wide variety of styles."
    },
    {
        question: "How does the image generation process work?",
        answer: "You simply type a descriptive prompt of the image you want to create, select your desired style and other creative options, and our AI model generates four unique image variations based on your input. It's like describing your idea to a digital artist who brings it to life instantly."
    },
    {
        question: "Is this service free to use?",
        answer: "Yes! Every new user gets 10 free credits to try out the platform. After that, you can choose from one of our affordable credit plans to continue generating images. Check our pricing section for more details."
    },
    {
        question: "Who owns the images I create?",
        answer: "You do. For users on any of our paid plans (Pro, Mega, or Booster), you receive full ownership and commercial rights for the images you generate. You can use them for personal or professional projects without any restrictions. Free plan users have a personal use license."
    },
    {
        question: "What makes Imagen Max BrainAi different from other AI generators?",
        answer: "Our platform focuses on providing deep customization and creative control. Instead of just a simple prompt, you can fine-tune aspects like artistic style, mood, lighting, and color palette. Plus, our quad-image generation gives you more options to choose from with every prompt."
    },
    {
        question: "Why do I get four images for every prompt?",
        answer: "We generate four variations to give you a range of creative interpretations of your prompt. AI can be unpredictable, and this approach increases the chance that you'll get a result you love without needing to re-run the prompt multiple times."
    },
    {
        question: "Can I control the dimensions of the generated images?",
        answer: "Yes. In the 'Creative Tools' section, you can select from a wide variety of aspect ratios, from square (1:1) to widescreen cinematic (16:9) and even tall portraits (9:16), to perfectly fit your needs."
    },
    {
        question: "What are some tips for getting the best results?",
        answer: "Be descriptive and specific in your prompts. Use vivid adjectives and think about the composition, subject, and environment. Don't be afraid to experiment with different styles and creative controls—sometimes the most unexpected combination yields the best results!"
    },
    {
        question: "Is my data and are my prompts kept private?",
        answer: "Yes, your privacy is a top priority. Your prompts and generated images are your own. We do not use your data to train our models without your explicit consent. Please see our Privacy Policy for more details."
    },
    {
        question: "I have a question or need help. How can I get support?",
        answer: "We're here to help! You can visit our Contact Us page to send us a message directly. Users on our Pro and Mega plans receive priority support."
    }
];

export default function FAQ() {
  return (
    <section className="bg-secondary/30 text-center py-16 lg:py-24 px-4">
     <div className="container mx-auto max-w-4xl opacity-0 animate-fadeInUp" style={{animationDelay: '800ms'}}>
      <div className="text-center mb-12">
        <h2 className="text-4xl font-headline font-bold text-foreground">Frequently Asked Questions</h2>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Have questions? We've got answers. Here are some of the most common queries we receive about our platform.
        </p>
      </div>
      <Accordion type="single" collapsible className="w-full text-left">
        {faqData.map((item, index) => (
          <AccordionItem value={`item-${index + 1}`} key={index} className="bg-card/50 px-4 rounded-lg mb-2">
            <AccordionTrigger className="hover:no-underline font-bold text-lg">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      </div>
    </section>
  );
}
