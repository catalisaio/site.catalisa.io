import { useRef } from 'react';
import { Box, Container, Text, VStack, HStack, Icon } from '@chakra-ui/react';
import { useScroll, useTransform, useSpring, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  SiWhatsapp, SiTelegram, SiSlack, SiGmail, SiTwilio, SiMailchimp, SiSendgrid,
  SiSalesforce, SiHubspot, SiZoho, SiZendesk, SiIntercom, SiInstagram, SiFacebook,
  SiSap, SiTotvs, SiShopify, SiWoocommerce, SiVtex, SiCalendly, SiGooglemeet,
  SiStripe, SiMercadopago, SiPaypal, SiPagseguro, SiNotion, SiAirtable, SiTrello,
  SiZapier, SiMake, SiOpenai, SiPostgresql, SiMongodb, SiRedis, SiMysql,
  SiAmazonwebservices, SiGooglecloud, SiDigitalocean, SiHeroku, SiVercel, SiNetlify,
  SiCloudflare, SiFirebase, SiSupabase, SiDiscord, SiZoom, SiSignal, SiViber,
  SiLine, SiWebex, SiLinkedin, SiX, SiTiktok, SiYoutube, SiPinterest, SiReddit,
  SiSnapchat, SiThreads, SiOracle, SiMagento, SiSquarespace, SiBigcommerce, SiWix,
  SiPrestashop, SiSquare, SiAdyen, SiKlarna, SiWise, SiAsana, SiJira, SiConfluence,
  SiClickup, SiTodoist, SiBasecamp, SiLinear, SiGooglegemini, SiHuggingface,
  SiTensorflow, SiPytorch, SiLangchain, SiMariadb, SiSqlite, SiElasticsearch,
  SiCockroachlabs, SiNeo4J, SiApachecassandra, SiAmazondynamodb, SiSinglestore,
  SiPlanetscale, SiClickhouse, SiAmazons3, SiGoogledrive, SiDropbox, SiBox,
  SiGoogleanalytics, SiMixpanel, SiDatadog, SiGrafana, SiNewrelic, SiSentry,
  SiHotjar, SiTableau, SiLooker, SiApacheairflow, SiDocker, SiKubernetes,
  SiGithub, SiGitlab, SiBitbucket, SiJenkins, SiGithubactions, SiCircleci,
  SiTerraform, SiAnsible, SiAuth0, SiOkta, SiKeycloak, SiQuickbooks, SiXero,
  SiGoogleads, SiSemrush, SiContentful, SiWordpress, SiGhost, SiStrapi, SiSanity,
  SiGooglemaps, SiMapbox, SiDhl, SiFedex, SiUps, SiVonage, SiTwitch,
  SiApachekafka, SiRabbitmq, SiGraphql, SiSwagger, SiPostman, SiInsomnia,
  SiSpotify, SiUber, SiAirbnb, SiNetflix, SiGooglesheets, SiGooglecalendar,
  SiCanva, SiFigma, SiMiro, SiPagerduty, SiOpsgenie, SiN8N, SiApachespark,
  SiSnowflake, SiDatabricks, SiApachehadoop, SiBamboo, SiSonarqube,
} from 'react-icons/si';
import type { IconType } from 'react-icons';
import { GradientText } from '../shared/GradientText';

interface Brand {
  name: string;
  icon: IconType;
  color: string;
}

const brands: Brand[] = [
  // Messaging & Communication
  { name: 'WhatsApp', icon: SiWhatsapp, color: '#25D366' },
  { name: 'Telegram', icon: SiTelegram, color: '#26A5E4' },
  { name: 'Slack', icon: SiSlack, color: '#4A154B' },
  { name: 'Discord', icon: SiDiscord, color: '#5865F2' },
  { name: 'Gmail', icon: SiGmail, color: '#EA4335' },
  { name: 'Twilio', icon: SiTwilio, color: '#F22F46' },
  { name: 'Vonage', icon: SiVonage, color: '#FFFFFF' },
  { name: 'Mailchimp', icon: SiMailchimp, color: '#FFE01B' },
  { name: 'SendGrid', icon: SiSendgrid, color: '#1A82E2' },
  { name: 'Zoom', icon: SiZoom, color: '#0B5CFF' },
  { name: 'Google Meet', icon: SiGooglemeet, color: '#00897B' },
  { name: 'Webex', icon: SiWebex, color: '#00BCF2' },
  { name: 'Signal', icon: SiSignal, color: '#3A76F0' },
  { name: 'Viber', icon: SiViber, color: '#7360F2' },
  { name: 'Line', icon: SiLine, color: '#00C300' },
  // CRM & Support
  { name: 'Salesforce', icon: SiSalesforce, color: '#00A1E0' },
  { name: 'HubSpot', icon: SiHubspot, color: '#FF7A59' },
  { name: 'Zoho', icon: SiZoho, color: '#E42527' },
  { name: 'Zendesk', icon: SiZendesk, color: '#03363D' },
  { name: 'Intercom', icon: SiIntercom, color: '#6AFDEF' },
  // Social Media
  { name: 'Instagram', icon: SiInstagram, color: '#E4405F' },
  { name: 'Facebook', icon: SiFacebook, color: '#1877F2' },
  { name: 'LinkedIn', icon: SiLinkedin, color: '#0A66C2' },
  { name: 'X', icon: SiX, color: '#000000' },
  { name: 'TikTok', icon: SiTiktok, color: '#000000' },
  { name: 'YouTube', icon: SiYoutube, color: '#FF0000' },
  { name: 'Pinterest', icon: SiPinterest, color: '#E60023' },
  { name: 'Reddit', icon: SiReddit, color: '#FF4500' },
  { name: 'Snapchat', icon: SiSnapchat, color: '#FFFC00' },
  { name: 'Threads', icon: SiThreads, color: '#000000' },
  { name: 'Twitch', icon: SiTwitch, color: '#9146FF' },
  // ERP & Enterprise
  { name: 'SAP', icon: SiSap, color: '#0FAAFF' },
  { name: 'TOTVS', icon: SiTotvs, color: '#00A5E3' },
  { name: 'Oracle', icon: SiOracle, color: '#F80000' },
  // E-commerce
  { name: 'Shopify', icon: SiShopify, color: '#7AB55C' },
  { name: 'WooCommerce', icon: SiWoocommerce, color: '#96588A' },
  { name: 'VTEX', icon: SiVtex, color: '#F71963' },
  { name: 'Magento', icon: SiMagento, color: '#EE672F' },
  { name: 'BigCommerce', icon: SiBigcommerce, color: '#121118' },
  { name: 'Squarespace', icon: SiSquarespace, color: '#000000' },
  { name: 'Wix', icon: SiWix, color: '#0C6EFC' },
  { name: 'PrestaShop', icon: SiPrestashop, color: '#DF0067' },
  // Payments
  { name: 'Stripe', icon: SiStripe, color: '#635BFF' },
  { name: 'Mercado Pago', icon: SiMercadopago, color: '#00B1EA' },
  { name: 'PayPal', icon: SiPaypal, color: '#003087' },
  { name: 'PagSeguro', icon: SiPagseguro, color: '#FFC801' },
  { name: 'Square', icon: SiSquare, color: '#006AFF' },
  { name: 'Adyen', icon: SiAdyen, color: '#0ABF53' },
  { name: 'Klarna', icon: SiKlarna, color: '#FFB3C7' },
  { name: 'Wise', icon: SiWise, color: '#9FE870' },
  // Productivity & PM
  { name: 'Notion', icon: SiNotion, color: '#000000' },
  { name: 'Airtable', icon: SiAirtable, color: '#18BFFF' },
  { name: 'Trello', icon: SiTrello, color: '#0052CC' },
  { name: 'Asana', icon: SiAsana, color: '#F06A6A' },
  { name: 'Jira', icon: SiJira, color: '#0052CC' },
  { name: 'Confluence', icon: SiConfluence, color: '#172B4D' },
  { name: 'ClickUp', icon: SiClickup, color: '#7B68EE' },
  { name: 'Todoist', icon: SiTodoist, color: '#E44332' },
  { name: 'Basecamp', icon: SiBasecamp, color: '#1D2D35' },
  { name: 'Linear', icon: SiLinear, color: '#5E6AD2' },
  { name: 'Calendly', icon: SiCalendly, color: '#006BFF' },
  // Automation & Integration
  { name: 'Zapier', icon: SiZapier, color: '#FF4A00' },
  { name: 'Make', icon: SiMake, color: '#6D00CC' },
  { name: 'n8n', icon: SiN8N, color: '#EA4B71' },
  // AI & ML
  { name: 'OpenAI', icon: SiOpenai, color: '#412991' },
  { name: 'Gemini', icon: SiGooglegemini, color: '#8E75B2' },
  { name: 'Hugging Face', icon: SiHuggingface, color: '#FFD21E' },
  { name: 'TensorFlow', icon: SiTensorflow, color: '#FF6F00' },
  { name: 'PyTorch', icon: SiPytorch, color: '#EE4C2C' },
  { name: 'LangChain', icon: SiLangchain, color: '#1C3C3C' },
  // Databases
  { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1' },
  { name: 'MongoDB', icon: SiMongodb, color: '#47A248' },
  { name: 'Redis', icon: SiRedis, color: '#DC382D' },
  { name: 'MySQL', icon: SiMysql, color: '#4479A1' },
  { name: 'MariaDB', icon: SiMariadb, color: '#003545' },
  { name: 'SQLite', icon: SiSqlite, color: '#003B57' },
  { name: 'Elasticsearch', icon: SiElasticsearch, color: '#005571' },
  { name: 'Neo4j', icon: SiNeo4J, color: '#4581C3' },
  { name: 'Cassandra', icon: SiApachecassandra, color: '#1287B1' },
  { name: 'DynamoDB', icon: SiAmazondynamodb, color: '#4053D6' },
  { name: 'CockroachDB', icon: SiCockroachlabs, color: '#6933FF' },
  { name: 'SingleStore', icon: SiSinglestore, color: '#AA00FF' },
  { name: 'PlanetScale', icon: SiPlanetscale, color: '#000000' },
  { name: 'ClickHouse', icon: SiClickhouse, color: '#FFCC21' },
  // Cloud & Infra
  { name: 'AWS', icon: SiAmazonwebservices, color: '#FF9900' },
  { name: 'Google Cloud', icon: SiGooglecloud, color: '#4285F4' },
  { name: 'DigitalOcean', icon: SiDigitalocean, color: '#0080FF' },
  { name: 'Heroku', icon: SiHeroku, color: '#430098' },
  { name: 'Vercel', icon: SiVercel, color: '#000000' },
  { name: 'Netlify', icon: SiNetlify, color: '#00C7B7' },
  { name: 'Cloudflare', icon: SiCloudflare, color: '#F38020' },
  { name: 'Firebase', icon: SiFirebase, color: '#FFCA28' },
  { name: 'Supabase', icon: SiSupabase, color: '#3FCF8E' },
  // Storage
  { name: 'Amazon S3', icon: SiAmazons3, color: '#569A31' },
  { name: 'Google Drive', icon: SiGoogledrive, color: '#4285F4' },
  { name: 'Dropbox', icon: SiDropbox, color: '#0061FF' },
  { name: 'Box', icon: SiBox, color: '#0061D5' },
  // Analytics & Monitoring
  { name: 'Google Analytics', icon: SiGoogleanalytics, color: '#E37400' },
  { name: 'Mixpanel', icon: SiMixpanel, color: '#7856FF' },
  { name: 'Datadog', icon: SiDatadog, color: '#632CA6' },
  { name: 'Grafana', icon: SiGrafana, color: '#F46800' },
  { name: 'New Relic', icon: SiNewrelic, color: '#1CE783' },
  { name: 'Sentry', icon: SiSentry, color: '#362D59' },
  { name: 'Hotjar', icon: SiHotjar, color: '#FF3C00' },
  { name: 'Tableau', icon: SiTableau, color: '#E97627' },
  { name: 'Looker', icon: SiLooker, color: '#4285F4' },
  { name: 'Snowflake', icon: SiSnowflake, color: '#29B5E8' },
  { name: 'Databricks', icon: SiDatabricks, color: '#FF3621' },
  // DevOps & CI/CD
  { name: 'Docker', icon: SiDocker, color: '#2496ED' },
  { name: 'Kubernetes', icon: SiKubernetes, color: '#326CE5' },
  { name: 'GitHub', icon: SiGithub, color: '#181717' },
  { name: 'GitLab', icon: SiGitlab, color: '#FC6D26' },
  { name: 'Bitbucket', icon: SiBitbucket, color: '#0052CC' },
  { name: 'Jenkins', icon: SiJenkins, color: '#D24939' },
  { name: 'GitHub Actions', icon: SiGithubactions, color: '#2088FF' },
  { name: 'CircleCI', icon: SiCircleci, color: '#343434' },
  { name: 'Terraform', icon: SiTerraform, color: '#844FBA' },
  { name: 'Ansible', icon: SiAnsible, color: '#EE0000' },
  // Auth & Security
  { name: 'Auth0', icon: SiAuth0, color: '#EB5424' },
  { name: 'Okta', icon: SiOkta, color: '#007DC1' },
  { name: 'Keycloak', icon: SiKeycloak, color: '#4D4D4D' },
  // Finance & Accounting
  { name: 'QuickBooks', icon: SiQuickbooks, color: '#2CA01C' },
  { name: 'Xero', icon: SiXero, color: '#13B5EA' },
  // Marketing & CMS
  { name: 'Google Ads', icon: SiGoogleads, color: '#4285F4' },
  { name: 'Semrush', icon: SiSemrush, color: '#FF642D' },
  { name: 'Contentful', icon: SiContentful, color: '#2478CC' },
  { name: 'WordPress', icon: SiWordpress, color: '#21759B' },
  { name: 'Ghost', icon: SiGhost, color: '#15171A' },
  { name: 'Strapi', icon: SiStrapi, color: '#4945FF' },
  { name: 'Sanity', icon: SiSanity, color: '#F03E2F' },
  // Maps
  { name: 'Google Maps', icon: SiGooglemaps, color: '#4285F4' },
  { name: 'Mapbox', icon: SiMapbox, color: '#000000' },
  // Logistics
  { name: 'DHL', icon: SiDhl, color: '#FFCC00' },
  { name: 'FedEx', icon: SiFedex, color: '#4D148C' },
  { name: 'UPS', icon: SiUps, color: '#FFB500' },
  // Event & Queue
  { name: 'Kafka', icon: SiApachekafka, color: '#231F20' },
  { name: 'RabbitMQ', icon: SiRabbitmq, color: '#FF6600' },
  // APIs & Dev Tools
  { name: 'GraphQL', icon: SiGraphql, color: '#E10098' },
  { name: 'Swagger', icon: SiSwagger, color: '#85EA2D' },
  { name: 'Postman', icon: SiPostman, color: '#FF6C37' },
  { name: 'Insomnia', icon: SiInsomnia, color: '#4000BF' },
  // Design
  { name: 'Figma', icon: SiFigma, color: '#F24E1E' },
  { name: 'Canva', icon: SiCanva, color: '#00C4CC' },
  { name: 'Miro', icon: SiMiro, color: '#FFD02F' },
  // Calendar & Sheets
  { name: 'Google Sheets', icon: SiGooglesheets, color: '#34A853' },
  { name: 'Google Calendar', icon: SiGooglecalendar, color: '#4285F4' },
  // Data
  { name: 'Airflow', icon: SiApacheairflow, color: '#017CEE' },
  { name: 'Spark', icon: SiApachespark, color: '#E25A1C' },
  { name: 'Hadoop', icon: SiApachehadoop, color: '#66CCFF' },
  // Ops
  { name: 'PagerDuty', icon: SiPagerduty, color: '#06AC38' },
  { name: 'Opsgenie', icon: SiOpsgenie, color: '#2684FF' },
  { name: 'SonarQube', icon: SiSonarqube, color: '#4E9BCD' },
  { name: 'Bamboo', icon: SiBamboo, color: '#0052CC' },
  // Entertainment & Lifestyle
  { name: 'Spotify', icon: SiSpotify, color: '#1DB954' },
  { name: 'Netflix', icon: SiNetflix, color: '#E50914' },
  { name: 'Uber', icon: SiUber, color: '#000000' },
  { name: 'Airbnb', icon: SiAirbnb, color: '#FF5A5F' },
];

// Split brands into rows for the marquee
const row1 = brands.slice(0, Math.ceil(brands.length / 3));
const row2 = brands.slice(Math.ceil(brands.length / 3), Math.ceil((brands.length * 2) / 3));
const row3 = brands.slice(Math.ceil((brands.length * 2) / 3));

function ScrollRow({ items, reverse = false, scrollYProgress }: { items: Brand[]; reverse?: boolean; scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'] }) {
  const doubled = [...items, ...items];
  const rawX = useTransform(
    scrollYProgress,
    [0, 1],
    reverse ? ['-8%', '0%'] : ['0%', '-8%'],
  );
  const x = useSpring(rawX, { stiffness: 40, damping: 35, mass: 1.2 });

  return (
    <Box overflow="hidden" position="relative" w="100%">
      <motion.div style={{ x, display: 'flex', gap: '2rem', width: 'max-content', padding: '0.75rem 0' }}>
        {doubled.map((brand, i) => (
          <HStack
            key={`${brand.name}-${i}`}
            spacing={2}
            flexShrink={0}
            opacity={0.55}
            _hover={{ opacity: 1 }}
            transition="opacity 0.2s"
            cursor="default"
          >
            <Icon as={brand.icon} boxSize={{ base: 5, md: 6 }} color={brand.color} />
            <Text
              fontSize={{ base: 'xs', md: 'sm' }}
              fontWeight="600"
              color="gray.500"
              whiteSpace="nowrap"
            >
              {brand.name}
            </Text>
          </HStack>
        ))}
      </motion.div>
    </Box>
  );
}

export function IntegrationShowcase() {
  const { t } = useTranslation('common');
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  return (
    <Box id="integrations" ref={containerRef} bg="white" py={{ base: 10, md: 14, lg: 18 }} overflow="hidden">
      <Container maxW="1280px" mb={{ base: 6, md: 10 }}>
        <VStack spacing={3}>
          <Text
            fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
            fontWeight="800"
            textAlign="center"
            color="gray.800"
            lineHeight="shorter"
          >
            {t('integrationShowcase.heading')}{' '}
            <GradientText>{t('integrationShowcase.headingGradient')}</GradientText>
          </Text>
          <Text
            fontSize={{ base: 'sm', md: 'md' }}
            color="gray.500"
            textAlign="center"
            maxW="600px"
          >
            {t('integrationShowcase.subtitle')}
          </Text>
        </VStack>
      </Container>

      <Box position="relative">
        {/* Fade edges */}
        <Box position="absolute" left={0} top={0} bottom={0} w={{ base: '40px', md: '120px' }} bgGradient="linear(to-r, white, transparent)" zIndex={1} />
        <Box position="absolute" right={0} top={0} bottom={0} w={{ base: '40px', md: '120px' }} bgGradient="linear(to-l, white, transparent)" zIndex={1} />

        <VStack spacing={0}>
          <ScrollRow items={row1} scrollYProgress={scrollYProgress} />
          <ScrollRow items={row2} scrollYProgress={scrollYProgress} reverse />
          <ScrollRow items={row3} scrollYProgress={scrollYProgress} />
        </VStack>
      </Box>
    </Box>
  );
}
