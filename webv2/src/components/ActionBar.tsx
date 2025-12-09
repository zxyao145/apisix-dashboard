/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ActionBarProps {
  step?: number;
  lastStep?: number;
  onChange?: (nextStep: number) => void;
  withResultView?: boolean;
  loading?: boolean;
  onSubmit?: () => void;
  onCancel?: () => void;
  className?: string;
}

export function ActionBar({
  step = 1,
  lastStep = 1,
  onChange,
  withResultView,
  loading,
  onSubmit,
  onCancel,
  className,
}: ActionBarProps) {
  const t = useTranslations('component.global');

  // Hide action bar for result view
  if (step > lastStep && withResultView) {
    return null;
  }

  const handlePrevious = () => {
    if (onChange && step > 1) {
      onChange(step - 1);
    }
  };

  const handleNext = () => {
    if (step < lastStep && onChange) {
      onChange(step + 1);
    } else if (step === lastStep && onSubmit) {
      onSubmit();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div
      className={cn(
        'fixed bottom-0 right-0 flex w-full items-center justify-end gap-2 border-t bg-background px-6 py-3',
        className
      )}
    >
      {onCancel && (
        <Button variant="outline" onClick={handleCancel}>
          {t('cancel')}
        </Button>
      )}
      {lastStep > 1 && (
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={step === 1}
        >
          {t('preStep') || 'Previous'}
        </Button>
      )}
      <Button onClick={handleNext} disabled={loading}>
        {loading ? (
          <>{t('loading')}</>
        ) : step < lastStep ? (
          t('nextStep') || 'Next'
        ) : (
          t('submit')
        )}
      </Button>
    </div>
  );
}

export default ActionBar;
