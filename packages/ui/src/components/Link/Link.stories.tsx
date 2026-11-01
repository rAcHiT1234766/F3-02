import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from './Link';

const meta = {
  title: 'Actions/Link',
  component: Link,
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'Link text. Describe the destination rather than writing “click here”.',
    },
  },
  args: { href: '#destination', children: 'View employee details' },
  parameters: {
    docs: {
      description: {
        component:
          'Native anchor, required href, forwarded anchor ref. Enter navigates; Ctrl/Cmd click, downloads and native events remain available. No disabled state: omit navigation when unavailable. target=_blank adds noopener noreferrer while preserving rel; include a new-tab notice in the text.',
      },
    },
  },
} satisfies Meta<typeof Link>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Dark: Story = { parameters: { theme: 'dark' } };
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: 240 }}>
        <Story />
      </div>
    ),
  ],
};
export const External: Story = {
  args: {
    href: 'https://example.com',
    target: '_blank',
    children: 'Company website (opens in a new tab)',
  },
};
export const InPage: Story = {
  render: () => (
    <>
      <Link href="#employee-section">Jump to employee details</Link>
      <section id="employee-section" tabIndex={-1} style={{ marginTop: 48 }}>
        <h2>Employee details</h2>
      </section>
    </>
  ),
};
