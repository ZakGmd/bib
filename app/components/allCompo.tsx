

export default function Components(){

    return(
        <>
        <div className="w-full flex items-center justify-center">
              <article className="book-card ">
          <div className="book-cover-container">
            <div className="book-cover-placeholder">Clean Code</div>
            <span className="availability-badge available">3 Available</span>
          </div>
          <div className="book-info">
            <div className="book-category">Technology</div>
            <h3 className="book-title">Clean Code: A Handbook of Agile Software Craftsmanship</h3>
            <p className="book-author">Robert C. Martin</p>
            <div className="book-meta">
              <div className="meta-item">
                <span className="meta-label">Published</span>
                <span className="meta-value">2008</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Copies</span>
                <span className="meta-value">3 / 3</span>
              </div>
            </div>
            <div className="book-actions">
              <button className="btn btn-primary">Request Loan</button>
              <button className="btn btn-secondary">View Details</button>
            </div>
          </div>
        </article>
         <article className="book-card ">
          <div className="book-cover-container">
            <div className="book-cover-placeholder">Clean Code</div>
            <span className="availability-badge available">3 Available</span>
          </div>
          <div className="book-info">
            <div className="book-category">Technology</div>
            <h3 className="book-title">Clean Code: A Handbook of Agile Software Craftsmanship</h3>
            <p className="book-author">Robert C. Martin</p>
            <div className="book-meta">
              <div className="meta-item">
                <span className="meta-label">Published</span>
                <span className="meta-value">2008</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Copies</span>
                <span className="meta-value">3 / 3</span>
              </div>
            </div>
            <div className="book-actions">
              <button className="btn btn-primary">Request Loan</button>
              <button className="btn btn-secondary">View Details</button>
            </div>
          </div>
        </article>
        </div>
        
        </>
    )
}