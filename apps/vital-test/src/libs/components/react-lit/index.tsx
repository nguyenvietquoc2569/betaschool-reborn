import React from 'react'
import { createComponent } from '@lit/react'

import { Card } from '@kyndryl-design-system/shidoka-foundation/components/card/index'
import { Icon } from '@kyndryl-design-system/shidoka-foundation/components/icon/index'
import { Button } from '@kyndryl-design-system/shidoka-foundation/components/button/index'
import { Modal } from '@kyndryl-design-system/shidoka-applications/components/reusable/modal'
import { Tabs, Tab, TabPanel } from '@kyndryl-design-system/shidoka-applications/components/reusable/tabs/index'
import { Checkbox, CheckboxGroup } from '@kyndryl-design-system/shidoka-applications/components/reusable/checkbox/index'
import { TextArea } from '@kyndryl-design-system/shidoka-applications/components/reusable/textArea'
import { DateRangePicker } from '@kyndryl-design-system/shidoka-applications/components/reusable/daterangepicker'
import { SideDrawer } from '@kyndryl-design-system/shidoka-applications/components/reusable/sideDrawer'
import { PageTitle } from '@kyndryl-design-system/shidoka-applications/components/reusable/pagetitle'
import { Tag, TagGroup } from '@kyndryl-design-system/shidoka-applications/components/reusable/tag'
import { GlobalFilter } from '@kyndryl-design-system/shidoka-applications/components/reusable/globalFilter'
import { TextInput } from '@kyndryl-design-system/shidoka-applications/components/reusable/textInput'
import { DatePicker } from '@kyndryl-design-system/shidoka-applications/components/reusable/datePicker'
import { Notification } from "@kyndryl-design-system/shidoka-applications/components/reusable/notification"
import { Link } from '@kyndryl-design-system/shidoka-foundation/components/link/index';
import { Tooltip } from '@kyndryl-design-system/shidoka-applications/components/reusable/tooltip/index';
import { Footer } from '@kyndryl-design-system/shidoka-applications/components/global/footer/index'
import { UiShell } from '@kyndryl-design-system/shidoka-applications/components/global/uiShell/index'
// import { Header } from '@kyndryl-design-system/shidoka-applications/components/global/header/index'

export const KDFooter = createComponent({
  tagName: 'kyn-footer',
  elementClass: Footer,
  react: React
})

export const KDShell = createComponent({
  tagName: 'kyn-ui-shell',
  elementClass: UiShell,
  react: React
})

export const KDTooltip = createComponent({
  tagName: 'kyn-tooltip',
  elementClass: Tooltip,
  react: React
})

export const KDTabs = createComponent({
  tagName: 'kyn-tabs',
  elementClass: Tabs,
  react: React,
  events: {
    onChange: 'on-change',
  }
})

export const KDTab = createComponent({
  tagName: 'kyn-tab',
  elementClass: Tab,
  react: React
})

export const KDTabPanel = createComponent({
  tagName: 'kyn-tab-panel',
  elementClass: TabPanel,
  react: React
})

export const KDIcon = createComponent({
  tagName: 'kd-icon',
  elementClass: Icon,
  react: React,
})

export const KDButton = createComponent({
  tagName: 'kd-button',
  elementClass: Button,
  react: React,
  events: {
    onClick: 'on-click',
  }
})

export const ModalBox = createComponent({
  tagName: 'kyn-modal',
  elementClass: Modal,
  react: React,
  events: {
    onClose: 'on-close',
  }
})

export const CheckBox = createComponent({
  tagName: 'kyn-checkbox',
  elementClass: Checkbox,
  react: React,
  events: {
    onSelect: 'on-checkbox-change'
  }
})

export const KDCard = createComponent({
  tagName: 'kd-card',
  elementClass: Card,
  react: React,
  events: {
    onCardClick: 'on-card-click'
  }
})

export const CheckBoxGroup = createComponent({
  tagName: 'kyn-checkbox-group',
  elementClass: CheckboxGroup,
  react: React,
  events: {
    onCheckboxGroupChange: 'on-checkbox-group-change',
  }
})

export const KDTextArea = createComponent({
  tagName: 'kyn-text-area',
  elementClass: TextArea,
  react: React,
  events: {
    onInput: 'on-input',
  }
})

export const DateRange = createComponent({
  tagName: 'kyn-date-range-picker',
  elementClass: DateRangePicker,
  react: React,
  events: {
    onInput: 'on-input',
  }
})

export const KDDrawer = createComponent({
  tagName: 'kyn-side-drawer',
  elementClass: SideDrawer,
  react: React,
  events: {
    onClose: 'on-close',
  }
})

export const KDTag = createComponent({
  tagName: 'kyn-tag',
  elementClass: Tag,
  react: React,
  events: {
    onClose: 'on-close'
  }
})

export const FilterBox = createComponent({
  tagName: 'kyn-global-filter',
  elementClass: GlobalFilter,
  react: React
})

export const Textbox = createComponent({
  tagName: 'kyn-text-input',
  elementClass: TextInput,
  react: React,
  events: {
    onOnInput: 'on-on-input',
    inputChange: 'on-input'
  }
})

export const KDTagGroup = createComponent({
  tagName: 'kyn-tag-Group',
  elementClass: TagGroup,
  react: React
})

export const KDDatePicker = createComponent({
  tagName: 'kyn-date-picker',
  elementClass: DatePicker,
  react: React,
  events: {
    onDateChange: 'on-input'
  }
})

export const KDDateRangePicker = createComponent({
  tagName: 'kyn-date-range-picker',
  elementClass: DateRangePicker,
  react: React,
  events: {
    onDateChange: 'on-input'
  }
})

export const CustomerDetailPageTitle = createComponent({
  tagName: 'kyn-page-title',
  elementClass: PageTitle,
  react: React
})

export const CustomCard = createComponent({
  tagName: 'kd-card',
  elementClass: Card,
  react: React
})

export const KDNotification = createComponent({
  tagName: 'kyn-notification',
  elementClass: Notification,
  react: React,
  events: {
    onClose: 'on-close'
  }
});

export const KDLink = createComponent({
  tagName: 'kd-link',
  elementClass: Link,
  react: React
});
