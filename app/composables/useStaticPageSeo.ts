
import { staticPagesSeoData } from "~/constants/static-pages-seo";
type PageKeys = keyof typeof staticPagesSeoData;

export default function useStaticPageSeo( pageKey: PageKeys = "home" ) {
  const { locale } = useI18n();

  const seoData = computed(() => {
    const page = staticPagesSeoData[pageKey as PageKeys];
    return page?.[locale.value ] || staticPagesSeoData.home[locale.value];
  });

  useSeoMeta({
    title:computed(() => seoData.value.title),
    description: computed(() => seoData.value.description),
    ogDescription: computed(() => seoData.value.description),
    keywords: computed(() => seoData.value.keywords),
    ogTitle: computed(() => seoData.value.title),
    twitterCard: "summary_large_image",
  });
}