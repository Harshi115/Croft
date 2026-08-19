import type { Schema, Struct } from '@strapi/strapi';

export interface SectionsAccordion extends Struct.ComponentSchema {
  collectionName: 'components_sections_accordions';
  info: {
    displayName: 'Accordion';
  };
  attributes: {
    heading: Schema.Attribute.String;
    items: Schema.Attribute.Component<'sections.accordion-item', true>;
  };
}

export interface SectionsAccordionItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_accordion_items';
  info: {
    displayName: 'Accordion Item';
  };
  attributes: {
    answer: Schema.Attribute.Text & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsAnnouncement extends Struct.ComponentSchema {
  collectionName: 'components_sections_announcements';
  info: {
    displayName: 'Announcement Banner';
  };
  attributes: {
    active: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    endDate: Schema.Attribute.Date;
    linkHref: Schema.Attribute.String;
    linkLabel: Schema.Attribute.String;
    message: Schema.Attribute.String;
    startDate: Schema.Attribute.Date;
  };
}

export interface SectionsCarouselSlide extends Struct.ComponentSchema {
  collectionName: 'components_sections_carousel_slides';
  info: {
    displayName: 'Carousel Slide';
  };
  attributes: {
    ctaHref: Schema.Attribute.String;
    ctaLabel: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
  };
}

export interface SectionsContactForm extends Struct.ComponentSchema {
  collectionName: 'components_sections_contact_forms';
  info: {
    displayName: 'Contact Form';
  };
  attributes: {
    heading: Schema.Attribute.String;
    recipientOverride: Schema.Attribute.Email;
    variant: Schema.Attribute.Enumeration<['standard', 'compact']> &
      Schema.Attribute.DefaultTo<'standard'>;
  };
}

export interface SectionsGallery extends Struct.ComponentSchema {
  collectionName: 'components_sections_galleries';
  info: {
    displayName: 'Gallery';
  };
  attributes: {
    heading: Schema.Attribute.String;
    images: Schema.Attribute.Media<'images', true> & Schema.Attribute.Required;
    layout: Schema.Attribute.Enumeration<['grid', 'masonry']> &
      Schema.Attribute.DefaultTo<'grid'>;
  };
}

export interface SectionsHero extends Struct.ComponentSchema {
  collectionName: 'components_sections_heroes';
  info: {
    displayName: 'Hero';
  };
  attributes: {
    carouselSlides: Schema.Attribute.Component<'sections.carousel-slide', true>;
    ctaHref: Schema.Attribute.String;
    ctaLabel: Schema.Attribute.String;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'>;
    supportingCopy: Schema.Attribute.Text;
  };
}

export interface SectionsLogoStrip extends Struct.ComponentSchema {
  collectionName: 'components_sections_logo_strips';
  info: {
    displayName: 'Logo Strip';
  };
  attributes: {
    heading: Schema.Attribute.String;
    logos: Schema.Attribute.Media<'images', true>;
  };
}

export interface SectionsProjectGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_project_grids';
  info: {
    displayName: 'Project Grid';
  };
  attributes: {
    heading: Schema.Attribute.String;
    itemCount: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<6>;
    manualProjects: Schema.Attribute.Relation<
      'oneToMany',
      'api::project.project'
    >;
    mode: Schema.Attribute.Enumeration<
      ['manual', 'sector-filter', 'featured']
    > &
      Schema.Attribute.DefaultTo<'featured'>;
    sector: Schema.Attribute.Relation<'oneToOne', 'api::sector.sector'>;
  };
}

export interface SectionsRichText extends Struct.ComponentSchema {
  collectionName: 'components_sections_rich_texts';
  info: {
    displayName: 'Rich Text';
  };
  attributes: {
    content: Schema.Attribute.Blocks & Schema.Attribute.Required;
  };
}

export interface SectionsServiceSubsection extends Struct.ComponentSchema {
  collectionName: 'components_sections_service_subsections';
  info: {
    description: 'One topic block within a Service page: a heading, body text and a photo gallery.';
    displayName: 'Service Subsection';
  };
  attributes: {
    body: Schema.Attribute.RichText;
    gallery: Schema.Attribute.Media<'images', true>;
    heading: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'sections.accordion': SectionsAccordion;
      'sections.accordion-item': SectionsAccordionItem;
      'sections.announcement': SectionsAnnouncement;
      'sections.carousel-slide': SectionsCarouselSlide;
      'sections.contact-form': SectionsContactForm;
      'sections.gallery': SectionsGallery;
      'sections.hero': SectionsHero;
      'sections.logo-strip': SectionsLogoStrip;
      'sections.project-grid': SectionsProjectGrid;
      'sections.rich-text': SectionsRichText;
      'sections.service-subsection': SectionsServiceSubsection;
    }
  }
}
