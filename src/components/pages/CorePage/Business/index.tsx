import Page from 'components/templates/Page'
import React from 'react'
import BannerText from '../About/components/BannerText'
import { Box, Card, CardContent, Grid, Typography } from '@mui/material'
import ImageLazyLoading from 'components/atoms/ImageLazyLoading'
import SectionContact from '../ContactUs/SectionContact'

function Business() {
  return (<Page
    title={'Giải pháp dành cho doanh nghiệp'}
    description='Từ việc học kiến thức mới đến tìm kiếm công việc, khởi nghiệp hoặc phát triển kinh doanh, hãy chọn lộ trình học tập phù hợp với ước mơ của bạn và bắt đầu chuyến hành trình thành công của bạn.'
    image='https://spacedev.vn/images/share-fb-540x282-2.jpg'
  >
    <BannerText>
      <Box
        sx={{ maxWidth: 800, margin: '0 auto', mt: 15, mb: 15, textAlign: 'center' }}
      >
        Tận dụng hệ sinh thái công nghệ của <Box component="span" display="inline" sx={{ color: 'rgb(66, 133, 244)' }}>Spacedev</Box> để phát triển nguồn nhân lực <Box component="span" display="inline" sx={{ color: 'rgb(234, 67, 53)' }}>chất lượng cao</Box> cho công ty, tổ chức của bạn. Giải pháp học tập <Box component="span" display="inline" sx={{ color: 'rgb(249, 171, 0)' }}>tích hợp AI</Box> giúp nhân viên nhanh chóng đánh giá và nắm bắt <Box component="span" display="inline" sx={{ color: 'rgb(52, 168, 83)' }}>kiến thức mới</Box>, thúc đẩy sự <Box component="span" display="inline" sx={{ color: 'rgb(216, 18, 139)' }}>phát triển bền vững</Box>
      </Box>
    </BannerText>

    <Grid
      container
      spacing={3}
    >
      <Grid
        item
        xs={4}
      >
        <Typography variant='h2' sx={{ fontSize: 36, mb: 2, lineHeight: '44px', fontWeight: 600 }}>Khám phá các giải pháp <Box component="span" display="inline" sx={{ color: 'success.main' }}>hữu ích</Box> cho doanh nghiệp của bạn</Typography>
        <Typography>Hãy để spacedev hỗ trợ công ty, tổ chức của bạn trong việc phát triển con người, từ đó dẫn dắt doanh nghiệp của bạn đi đến thành công
        </Typography>

      </Grid>

      <Grid
        item
        xs={4}

      >
        <ServiceItem
          image='https://www.teachhub.com/wp-content/uploads/2020/05/Top-12-Pioneers-in-Education-scaled.jpg'
          title='Đào Tạo và Phát Triển Kỹ Năng'
        />
      </Grid>

      <Grid
        item
        xs={4}

      >
        <ServiceItem
          image='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmAwJ2J3jcH21vEwGt1J5m1BUnQde61f0iDeJfVUcRWw&s'
          title='Giải Pháp Công Nghệ'
        />
      </Grid>

      <Grid
        item
        xs={4}

      >
        <ServiceItem
          image='https://etimg.etb2bimg.com/photo/75729614.cms'
          title='Truyển dụng nhân sự'
        />
      </Grid>

      <Grid
        item
        xs={4}

      >
        <ServiceItem
          image='https://blog.hubspot.com/hubfs/growthstrategies.webp'
          title='Đánh Giá và Chứng Nhận'
        />
      </Grid>

      <Grid
        item
        xs={4}

      >
        <Card
          sx={{
            height: '100%',
          }}
        >
          <CardContent
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant='h3' sx={{
              fontSize: 26,
            }}>Nhiều hơn nữa</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>


    <BannerText>
      <Box
        sx={{ maxWidth: 800, margin: '0 auto', mt: 15, mb: 5, textAlign: 'center' }}
      >
        Giải pháp của chúng tôi phù hợp với ai?
      </Box>
    </BannerText>

    <Grid
      container
      spacing={3}
    >

      <Grid
        item
        xs={4}
      >
        <TargetItem
          image='/images/store.webp'
          title='Doanh nghiệp'
          color="secondary.main"
          description='Tăng Cường Hiệu Suất Nhân Sự Với Giải Pháp Đào Tạo Toàn Diện'
          // description='Bạn là doanh nghiệp với đội ngũ nhân viên công nghệ từ 1 đến hàng trăm người, với mong muốn nhân viên nắm bắt được các công nghệ mới nhất, tiếp cận với xu thế thới giới, đanh giá trình đồ của nhận sự, Spacedev có thể làm được thay cho bạn,'
          subDescription='Hợp tác với các doanh nghiệp công nghệ hàng đầu để cung cấp các khóa học lập trình và tiếng Anh chuyên ngành, giúp nhân viên của bạn nắm bắt nhanh chóng kiến thức và kỹ năng mới, từ đó nâng cao hiệu suất và hiệu quả công việc'
        />
      </Grid>

      <Grid
        item
        xs={4}
      >
        <TargetItem
          image='/images/clipboard.webp'
          title='Các cơ sở giáo dục'
          color="warning.main"
          description='Nâng Tầm Giáo Dục Với Chương Trình Đào Tạo Tiên Tiến'
          // description='Bạn là các cơ sở giáo dục như trung học, cao đẳng, đại học,... cần một nơi mà học viên có thể học tập, quản lý có thể theo dõi tiến độ dánh giá kết quả học tập từng cá nhân. Spacedev là nơi hoàn hảo cho bạn'
          subDescription='Hợp tác với các khoa công nghệ thông tin và ngôn ngữ để phát triển chương trình đào tạo chuyên sâu về lập trình và tiếng Anh. Tổ chức các workshop, seminar và chương trình trao đổi quốc tế, giúp sinh viên nắm bắt kiến thức và kỹ năng cần thiết cho tương lai.'
        />
      </Grid>



      <Grid
        item
        xs={4}
      >
        <TargetItem
          image='/images/graph.webp'
          title='Trung tâm giáo dục, nghề'
          color="primary.main"
          description='Đào Tạo Nghề Nghiệp Hiệu Quả Với Các Khóa Học Chuyên Sâu'
          // description='Bạn là doanh nghiệp với đội ngũ nhân viên công nghệ từ 1 đến hàng trăm người, với mong muốn nhân viên nắm bắt được các công nghệ mới nhất, tiếp cận với xu thế thới giới, đanh giá trình đồ của nhận sự, Spacedev có thể làm được thay cho bạn,'
          subDescription='Cung cấp các khóa học đào tạo nghề nghiệp về lập trình và tiếng Anh, giúp học viên nhanh chóng nắm bắt kỹ năng thực tiễn. Hợp tác với các trung tâm hỗ trợ việc làm để đảm bảo học viên có cơ hội thực tập và tìm kiếm việc làm phù hợp.'
        />
      </Grid>
    </Grid>
    <SectionContact subjectKey='for_work' />
  </Page>)
}

export default Business

function ServiceItem({ image, title }: { image: string, title: string }) {
  return <Card>
    <CardContent
      sx={{
        position: 'relative',
        p: 0,
        pb: '0 !important',
        display: 'flex',
        height: 300,
      }}
    >
      <ImageLazyLoading
        src={image}
        sx={{
          width: '100%',
          maxHeight: '100%',
          objectFit: 'cover',
        }}
      />
      <Typography variant='h4' sx={{
        fontSize: 22,
        mb: 2,
        lineHeight: '34px',
        fontWeight: 600,
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        p: 3,
        color: 'white',
      }}>{title}</Typography>

    </CardContent>
  </Card>
}


function TargetItem({ image, title, description, subDescription, color }: { image: string, description: string, title: string, subDescription: string, color: string }) {
  return <Box
    sx={{
      position: 'relative',
      p: 2,
      minHeight: 300,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}
  >
    <ImageLazyLoading
      src={image}
      sx={{
        width: 72,
        height: 72,
      }}
    />
    <Typography variant='h2' sx={{ mt: 3 }}>{title}</Typography>
    <Typography textAlign='justify' sx={{ mt: 2, lineHeight: '26px', }} ><Box component="span" display="inline" sx={{ fontWeight: 'bold', color: color }}>{description}</Box> {subDescription}</Typography>
  </Box >
}