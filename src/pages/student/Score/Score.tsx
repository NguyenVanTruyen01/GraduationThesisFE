import styles from './styles/score.module.scss'
// import StudentLayout from '@/layout/student/StudentLayout'
const Score = () => {
  return (
    // <StudentLayout>
        <div className={`${styles.score} item-center`}>
          <div className={styles.mainPage}>

                <form className={styles.form} >
                  <div className={  `${styles.headerForm} item-btw`}>
                      <h1 className={styles.titleForm}>Kết quả phản biện</h1>
                      <span className={styles.icons}><i className="fa-solid fa-file-arrow-down"></i></span>
                  </div>
                    <div className={`${styles.row} item-btw`}>
                        <div className={styles.item}>
                            <p className={styles.label}>Tính thực tiễn của đề tài , sự hiểu biết về vấn đề nghiên cứu </p>
                            <input type="text"  className={styles.inputScore}/>
                        </div>
                        <div className={styles.item}>
                            <p className={styles.label}>Chất lượng của bài thuyết trình</p>
                            <input type="text"  className={styles.inputScore}/>
                        </div>
                    </div>
                     <div className={`${styles.row} item-btw`}>
                        <div className={styles.item}>
                            <p className={styles.label}>Khả năng đọc sách ngoại ngữ tham khảo</p>
                            <input type="text"  className={styles.inputScore}/>
                        </div>
                        <div className={styles.item}>
                            <p className={styles.label}>Khả năng đọc sách ngoại ngữ tham khảo</p>
                            <input type="text"  className={styles.inputScore}/>
                        </div>
                    </div>
                     <div className={`${styles.row} item-btw`}>
                        <div className={styles.item}>
                            <p className={styles.label}>Tính đúng đắn , hợp lí và mức độ hoàn thiện của đề tài </p>
                            <input type="text"  className={styles.inputScore}/>
                        </div>
                        <div className={styles.item}>
                            <p className={styles.label}>Khả năng tổng hợp kiến thức, viết luận văn</p>
                            <input type="text"  className={styles.inputScore}/>
                        </div>
                    </div>
                     <div className={`${styles.row} item-btw`}>
                        <div className={styles.item}>
                            <p className={styles.label}>Chất lượng về hình thức của luận văn</p>
                            <input type="text"  className={styles.inputScore}/>
                        </div>
                        <div className={styles.item}>
                            <p className={styles.label}>Điểm 1</p>
                            <input type="text"  className={styles.inputScore}/>
                        </div>
                    </div>

                </form>
          </div>
        </div>
    // </StudentLayout>
   
  )
}

export default Score