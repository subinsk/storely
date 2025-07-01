import {
  BannerImageOne,
  BannerImageThree,
  BannerImageTwo,
  Parent,
} from "./styles";
import ImageBox from "./image-box";

export default function BannerImages() {
  return (
    <Parent>
      <BannerImageOne>
        <ImageBox banner="one" />
      </BannerImageOne>
      <BannerImageTwo>
        <ImageBox banner="two" />
      </BannerImageTwo>
      <BannerImageThree>
        <ImageBox banner="three" />
      </BannerImageThree>
    </Parent>
  );
}
