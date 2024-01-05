import { Haptics, ImpactStyle } from '@capacitor/haptics'

export async function hapticsImpactMedium() {
  await Haptics.impact({ style: ImpactStyle.Light })
}
