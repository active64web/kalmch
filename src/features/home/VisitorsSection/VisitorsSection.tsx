import React from "react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { analyticsService } from "@/server/services/analytics.service";
import { FlagImage } from "./FlagImage";
import styles from "./VisitorsSection.module.scss";

export async function VisitorsSection() {
  const { countries } = await analyticsService.getVisitorsAnalytics();

  return (
    <section className={styles.sectionWrapper} aria-label="قرّاء قَلَم حول العالم">
      <div className="container">
        <SectionHeader
          badge="انتشار قَلَم حول العالم"
          title="قرّاء قَلَم في مختلف البلدان"
          subtitle="نفخر بوصول الكلمة الروحية إلى آلاف القرّاء والباحثين في مختلف بلدان العالم"
          align="center"
        />

        <div className={styles.visitorsGrid}>
          {countries.map((country) => (
            <div
              key={country.id}
              className={styles.countryCard}
              aria-label={`${country.name}: ${country.displayCount}`}
            >
              <div className={styles.cardHeader}>
                <div className={styles.flagFrame} aria-hidden="true">
                  <FlagImage
                    flagUrl={country.flagUrl}
                    code={country.code}
                    name={country.name}
                    flagEmoji={country.flagEmoji}
                    className={styles.flagImage}
                  />
                </div>

                <div className={styles.countryInfo}>
                  <h3 className={styles.countryName} title={country.name}>
                    {country.name}
                  </h3>
                </div>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.countText}>
                  <span>{country.visitorsCount.toLocaleString("en-US")}</span>
                  زائر
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
