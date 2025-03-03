import { PF } from "../url";

const HomePosts = ({ post }) => {
  const imageUrl = post.photo && post.photo.startsWith("http") ? post.photo : `${PF}${post.photo}`;
   
  

  return (
    <article className="flex bg-white transition hover:shadow-xl mt-8">
      {/* Vertical Date Section */}
      <div className="rotate-180 p-2 [writing-mode:_vertical-lr]">
        <time
          dateTime={post.updatedAt.slice(0, 10)}
          className="flex items-center justify-between gap-4 text-xs font-bold uppercase text-gray-900"
        >
          <span>{post.updatedAt.slice(0, 4)}</span>
          <span className="w-px flex-1 bg-gray-900/10"></span>
          <span>
            {new Date(post.updatedAt).toLocaleString("default", {
              month: "short",
              day: "2-digit",
            })}
          </span>
        </time>
      </div>

      {/* Image Section */}
      <div className="hidden sm:block sm:basis-56">
        <img
          alt={post.title}
          src={imageUrl}
          className="aspect-square h-full w-full object-cover"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col justify-between">
        <div className="border-s border-gray-900/10 p-4 sm:border-l-transparent sm:p-6">
          <a href="#">
            <h3 className="font-bold uppercase text-gray-900">{post.title}</h3>
          </a>

           <p className='text-left md:text-lg'>
    {post.desc.slice(0,200)+" .... Read more"}
    </p>

        </div>

        {/* "Read Blog" Button */}
        <div className="sm:flex sm:items-end sm:justify-end">
          <a
            href="#"
            className="block bg-yellow-300 px-5 py-3 text-center text-xs font-bold uppercase text-gray-900 transition hover:bg-yellow-400"
          >
            Read Blog
          </a>
        </div>
      </div>
    </article>
  );
};

export default HomePosts;
