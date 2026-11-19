"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ClayCard } from "@/components/ui/ClayCard";
import { Badge } from "@/components/ui/Badge";

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: "Can AAVYA diagnose me with PCOS?",
      answer:
        "No. AAVYA is strictly an AI-assisted health risk screening and educational platform. In accordance with clinical guidelines (Rotterdam consensus criteria), a definitive PCOS diagnosis requires clinical assessment, biochemical hormone assays, and/or pelvic ultrasonography performed by a licensed physician.",
    },
    {
      question: "Why does AAVYA analyze 3 generations of family history?",
      answer:
        "Medical literature demonstrates that polycystic ovary syndrome exhibits strong heritability, with up to 70% familial aggregation. Maternal or sibling histories of irregular cycles, early cardiovascular disease, type 2 diabetes, or subfertility significantly shift clinical risk odds ratios.",
    },
    {
      question: "How accurate is the machine learning prediction model?",
      answer:
        "Our serialized model achieves 97.17% accuracy, 97.06% precision, and 94.29% recall on cross-validated multi-cohort datasets (integrating clinical, lifestyle, and pedigree callsets). It provides calibrated statistical probabilities rather than arbitrary guesswork.",
    },
    {
      question: "Can I use AAVYA if I haven't done blood tests yet?",
      answer:
        "Yes! Our system uses intelligent imputation algorithms trained on extensive clinical distributions. You can begin with observable symptoms (cycle patterns, skin/hair markers, lifestyle, family history), and add lab values later if available.",
    },
    {
      question: "How does the doctor booking feature work?",
      answer:
        "Once you complete your assessment, you can browse verified reproductive endocrinologists and gynecologists in our directory, filter by locality and specialty, and generate a secure clinical handover summary to share with your chosen doctor.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 border-t border-[var(--border)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="neutral" className="mb-3">
            Common Inquiries
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-[var(--foreground)]">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-[var(--muted-foreground)] mt-2.5">
            Transparent explanations of our methodology, clinical limitations, and data practices.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <ClayCard
                key={index}
                className="p-5 cursor-pointer transition-all duration-200"
                onClick={() => toggleFaq(index)}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-sm sm:text-base font-semibold font-display text-[var(--foreground)]">
                    {faq.question}
                  </h3>
                  <div
                    className={`size-7 rounded-full bg-[var(--background)] border border-[var(--border)] flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    <ChevronDown className="size-4 text-[var(--foreground)]" />
                  </div>
                </div>

                {isOpen && (
                  <div className="mt-3 pt-3 border-t border-[var(--border)] text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </ClayCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
