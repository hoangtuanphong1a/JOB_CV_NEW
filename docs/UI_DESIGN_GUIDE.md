# NextJS UI Design Guide - CVKing Job Portal

## Overview
This document outlines the UI design patterns and components from the NextJS UI Design Prompt that should be used for the CVKing job portal project.

## Design System

### Color Palette
- **Primary Color**: `#f26b38` (Orange)
- **Primary Dark**: `#e05a27`
- **Background**: `#ffffff` (White)
- **Foreground**: `#1a1a1a` (Dark Gray)
- **Secondary**: `#f5f5f5` (Light Gray)
- **Accent**: `#fff5f0` (Light Orange)
- **Muted**: `#6b7280` (Gray)
- **Destructive**: `#ef4444` (Red)
- **Border**: `#e5e7eb` (Light Gray)

### Typography
- **Font Size Base**: 16px
- **Font Weight Normal**: 400
- **Font Weight Medium**: 500
- **Line Height**: 1.5

### Border Radius
- **Small**: calc(var(--radius) - 4px)
- **Medium**: calc(var(--radius) - 2px)
- **Large**: var(--radius) (0.5rem)
- **XL**: calc(var(--radius) + 4px)

## Core Components

### 1. Header Component
**Features:**
- Sticky navigation with backdrop blur
- Logo with gradient background
- Responsive mobile menu
- User dropdown with role-based navigation
- Authentication state handling

**Key Elements:**
```tsx
- Logo: Gradient from #f26b38 to #e05a27
- Navigation: Role-based menu items
- User Avatar: Gradient background
- Mobile Menu: Hamburger toggle
```

### 2. Hero Section
**Features:**
- Gradient background (orange to pink)
- Decorative blur elements
- Call-to-action buttons
- Statistics display
- Floating success card

**Key Elements:**
```tsx
- Background: gradient-to-br from-orange-50 via-red-50 to-pink-50
- Primary CTA: bg-[#f26b38] hover:bg-[#e05a27]
- Secondary CTA: Outline variant
- Stats: 10,000+ jobs, 5,000+ companies, 50,000+ candidates
```

### 3. Search Bar Component
**Features:**
- Multi-field search (keyword, location)
- Icon integration (Search, MapPin)
- Responsive design
- Hover effects

### 4. Job Categories Component
**Features:**
- Grid layout
- Category cards with icons
- Hover animations
- Color-coded categories

### 5. Featured Jobs Component
**Features:**
- Job cards with company logos
- Featured badge (gradient)
- Bookmark functionality
- Job details (location, salary, type, level)
- Skills tags
- Apply button
- Posted time display

**Card Structure:**
```tsx
- Company Logo: 56x56 rounded-lg
- Job Title: text-lg, hover:text-[#f26b38]
- Company Name: text-sm text-gray-600
- Location/Salary/Type: Icons with text
- Skills: Badge components
- Footer: Time + Apply button
```

### 6. Featured Companies Component
**Features:**
- Company cards
- Logo display
- Company info
- Job count badge

### 7. Blog Preview Component
**Features:**
- Blog post cards
- Image display
- Category tags
- Read time
- Author info

### 8. Footer Component
**Features:**
- Multi-column layout
- Navigation links
- Social media icons
- Copyright info

## UI Components Library

### Button Component
**Variants:**
- `default`: Primary orange background
- `outline`: Border with hover effects
- `ghost`: Transparent with hover background
- `secondary`: Secondary background
- `destructive`: Red background
- `link`: Underline text

**Sizes:**
- `sm`: h-8, px-3
- `default`: h-9, px-4
- `lg`: h-10, px-6
- `icon`: size-9

### Card Component
**Sub-components:**
- `Card`: Main container with border and shadow
- `CardHeader`: Top section with title
- `CardTitle`: Heading element
- `CardDescription`: Subtitle text
- `CardContent`: Main content area
- `CardFooter`: Bottom section
- `CardAction`: Action buttons area

### Badge Component
**Variants:**
- `default`: Primary background
- `secondary`: Secondary background
- `outline`: Border only
- `destructive`: Red background

### Input Component
**Features:**
- Border with focus ring
- Placeholder styling
- File input support
- Disabled state
- Invalid state styling

### Textarea Component
**Features:**
- Resizable
- Min height
- Focus ring
- Disabled state

### Select Component
**Sub-components:**
- `Select`: Root container
- `SelectTrigger`: Dropdown trigger
- `SelectValue`: Selected value display
- `SelectContent`: Dropdown content
- `SelectItem`: Individual option
- `SelectGroup`: Option grouping
- `SelectLabel`: Group label
- `SelectSeparator`: Divider

### Checkbox Component
**Features:**
- Custom styling
- Check icon
- Focus ring
- Disabled state

### Dropdown Menu Component
**Sub-components:**
- `DropdownMenu`: Root container
- `DropdownMenuTrigger`: Trigger element
- `DropdownMenuContent`: Menu content
- `DropdownMenuItem`: Menu item
- `DropdownMenuCheckboxItem`: Checkbox item
- `DropdownMenuRadioGroup`: Radio group
- `DropdownMenuLabel`: Section label
- `DropdownMenuSeparator`: Divider

## Design Patterns

### 1. Gradient Usage
- Primary gradients: `from-[#f26b38] to-[#e05a27]`
- Background gradients: `from-orange-50 via-red-50 to-pink-50`
- Decorative gradients: `from-orange-200/30`, `from-pink-200/30`

### 2. Shadow and Depth
- Card shadows: `shadow-xl`, `shadow-2xl`
- Hover shadows: `hover:shadow-xl transition-shadow duration-300`
- Dropdown shadows: `shadow-md`, `shadow-lg`

### 3. Spacing and Layout
- Container: `container mx-auto px-4`
- Grid layouts: `grid md:grid-cols-2 lg:grid-cols-3 gap-6`
- Flex layouts: `flex items-center justify-between`
- Section padding: `py-16 lg:py-24`

### 4. Responsive Design
- Mobile-first approach
- Breakpoints: md, lg, xl
- Hidden on mobile: `hidden md:flex`
- Mobile menu: Collapsible navigation

### 5. Animations and Transitions
- Hover effects: `hover:bg-[#e05a27]`
- Transform: `group-hover:translate-x-1 transition-transform`
- Shadow transitions: `transition-shadow duration-300`
- Color transitions: `transition-colors`

### 6. Icon Integration
- Lucide React icons
- Icon sizing: `h-4 w-4`, `h-5 w-5`, `h-6 w-6`
- Icon colors: Inherit from parent or specific colors
- Icon positioning: `mr-2`, `ml-2`

## Page Structure Examples

### Home Page Layout
```
Header (sticky)
Hero Section (gradient background)
Search Bar
Job Categories (grid)
Featured Jobs (cards)
Featured Companies (cards)
Blog Preview (cards)
Footer
```

### Job Detail Page Layout
```
Header
Job Detail Content
- Job Header (title, company, meta)
- Job Description
- Requirements
- Benefits
- Application Form
Footer
```

### Dashboard Layout
```
Header
Sidebar Navigation
Main Content Area
- Statistics Cards
- Data Tables
- Action Buttons
Footer
```

## Best Practices

### 1. Color Usage
- Use primary orange (#f26b38) for main actions
- Use secondary colors for less important elements
- Maintain contrast ratios for accessibility
- Use gradients sparingly for emphasis

### 2. Typography
- Use consistent font sizes
- Maintain proper line heights
- Use font weights appropriately (400, 500)
- Ensure readable text sizes

### 3. Spacing
- Use consistent padding and margins
- Follow the spacing scale
- Maintain visual hierarchy
- Use whitespace effectively

### 4. Components
- Reuse UI components consistently
- Follow component variants
- Maintain consistent styling
- Use proper prop types

### 5. Responsiveness
- Design mobile-first
- Test on multiple screen sizes
- Use appropriate breakpoints
- Ensure touch-friendly interactions

## Implementation Notes

### Tailwind CSS Configuration
- Custom color variables
- Custom border radius
- Custom font sizes
- Animation utilities

### Component Structure
- Use TypeScript for type safety
- Follow React best practices
- Implement proper prop interfaces
- Use context for state management

### Performance
- Optimize images
- Lazy load components
- Minimize bundle size
- Use proper caching

## Vietnamese Language Support
All text content should be in Vietnamese:
- "Tìm việc ngay" (Find jobs now)
- "Tạo CV miễn phí" (Create free CV)
- "Việc làm nổi bật" (Featured jobs)
- "Công ty hàng đầu" (Top companies)
- "Đăng tin tuyển dụng" (Post job)

This design guide ensures consistency across the CVKing job portal while maintaining the professional, modern aesthetic established in the NextJS UI Design Prompt.