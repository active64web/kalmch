import React from "react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { visitorsData } from "@/data/visitors.data";
import styles from "./VisitorsSection.module.scss";

export const VisitorsSection: React.FC = () => {
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
          {visitorsData.map((country) => (
            <div
              key={country.id}
              className={styles.countryCard}
              aria-label={`${country.name}: ${country.displayCount}`}
            >
              <div className={styles.cardHeader}>
                <div className={styles.flagFrame} aria-hidden="true">
                  {/* High quality flag CDN with native alt and lazy load */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://flagcdn.com/w80/${country.code}.png`}
                    srcSet={`https://flagcdn.com/w80/${country.code}.png 1x, https://flagcdn.com/w160/${country.code}.png 2x`}
                    alt={`علم ${country.name}`}
                    width={40}
                    height={28}
                    className={styles.flagImage}
                    loading="lazy"
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
};
