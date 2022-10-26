import { LightningElement, track } from 'lwc';
import LIGHTNING_ORG_WIDE_FEATURE from '@salesforce/featureFlag/Lightning.org.orgWideFeature';
import LIGHTNING_USER_ENABLED_FEATURE from '@salesforce/featureFlag/Lightning.user.enabledFeature';
import LIGHTNING_USER_DISABLED_FEATURE from '@salesforce/featureFlag/Lightning.user.disabledFeature';
import SUPPORT_USER_FEATURE_FLAG from '@salesforce/featureFlag/Support.user.userOnlySupportFlag';
import TEST_SPECIAL_FEATURE from '@salesforce/featureFlag/TestOnly.org.specialFeature';
import TEST_EXAMPLE_FLAG from '@salesforce/featureFlag/TestOnly.org.exampleFlag';

const KEY_GARBAGE_DOES_NOT_EXIST = 'Garbage.org.notDefinedFlag';
const KEY_LIGHTNING_ORG_WIDE = 'Lightning.org.orgWideFeature';
const KEY_LIGHTNING_USER_ENABLED = 'Lightning.user.enabledFeature';
const KEY_LIGHTNING_USER_DISABLED = 'Lightning.user.disabledFeature';
const KEY_SUPPORT_USER_ONLY = 'Support.user.userOnlySupportFlag';
const KEY_TEST_ONLY_SPECIAL = 'TestOnly.org.specialFeature';
const KEY_TEST_ONLY_EXAMPLE = 'TestOnly.org.exampleFlag';

const OPTIONS = [
    { label: KEY_GARBAGE_DOES_NOT_EXIST, value: KEY_GARBAGE_DOES_NOT_EXIST },
    { label: KEY_LIGHTNING_ORG_WIDE, value: KEY_LIGHTNING_ORG_WIDE },
    { label: KEY_LIGHTNING_USER_ENABLED, value: KEY_LIGHTNING_USER_ENABLED },
    { label: KEY_LIGHTNING_USER_DISABLED, value: KEY_LIGHTNING_USER_DISABLED },
    { label: KEY_SUPPORT_USER_ONLY, value: KEY_SUPPORT_USER_ONLY },
    { label: KEY_TEST_ONLY_SPECIAL, value: KEY_TEST_ONLY_SPECIAL },
    { label: KEY_TEST_ONLY_EXAMPLE, value: KEY_TEST_ONLY_EXAMPLE },
];

const FLAG_MAP = {
    [KEY_LIGHTNING_ORG_WIDE]: LIGHTNING_ORG_WIDE_FEATURE,
    [KEY_LIGHTNING_USER_ENABLED]: LIGHTNING_USER_ENABLED_FEATURE,
    [KEY_LIGHTNING_USER_DISABLED]: LIGHTNING_USER_DISABLED_FEATURE,
    [KEY_SUPPORT_USER_ONLY]: SUPPORT_USER_FEATURE_FLAG,
    [KEY_TEST_ONLY_SPECIAL]: TEST_SPECIAL_FEATURE,
    [KEY_TEST_ONLY_EXAMPLE]: TEST_EXAMPLE_FLAG,
};

export default class CustomApp extends LightningElement {
    @track flagName;
    @track flagValue;

    get options() {
        return OPTIONS;
    }

    get isEmpty() {
        return this.flagName === undefined;
    }

    get isValid() {
        return FLAG_MAP[this.flagName] !== undefined;
    }

    handleChange(event) {
        this.flagName = event.detail.value;
        if (this.isValid) {
            this.flagValue = FLAG_MAP[this.flagName];
        }
    }
}
